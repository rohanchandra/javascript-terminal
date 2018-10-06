import { fsErrorType, makeError } from '../fs-error';
import * as BaseOp from '../operations/base-operations';
import * as FileUtil from '../util/file-util';
import * as GlobUtil from '../util/glob-util';
import * as PathUtil from '../util/path-util';
import { hasFile } from './file-operations';

import { IEmulatorError, IFileSystem } from '../../types';

const onlyFilesFilter = (fs: IFileSystem) => (path: string) =>
  FileUtil.isFile(fs.get(path));
const onlyDirectoriesFilter = (fs: IFileSystem) => (path: string) =>
  FileUtil.isDirectory(fs.get(path));

/**
 * Fill file system gaps with empty directories.
 *
 * EXPLANATION:
 * A file system can be left in a state where there the directory structure
 * is incomplete and there may be illogical gaps in the structure after
 * manually creating or editing the file system.
 *
 * For example, we might have a file system that looks like this after manually
 * adding a directory of '/a/b/c':
 *
 * {
 *  '/': {..}
 *  '/a/b/c': {..}
 * }
 *
 * As a result of the operation, we're missing directories of '/a' and '/a/b'.
 * We can fill these missing directory gaps to get a properly formed directory
 * structure:
 *
 * {
 *  '/': {..}
 *  '/a': {..}
 *  '/a/b': {..}
 *  '/a/b/c': {..}
 * }
 * @param  {Map}    fs   file system with gaps in directory structure
 * @return {Map}         file system without directory gaps
 */
export const fillGaps = (fs: IFileSystem) => {
  const emptyDirectory = FileUtil.makeDirectory();

  const directoryGapPaths = fs
    .keySeq() // sequence of paths
    .flatMap((path: string) => PathUtil.getPathBreadCrumbs(path))
    .filter((path: string) => !fs.has(path));

  return fs.withMutations((_fs: IFileSystem) => {
    for (const directoryGapPath of directoryGapPaths) {
      _fs.set(directoryGapPath, emptyDirectory);
    }
  });
};

/**
 * Check if a directory exists in the file system
 * @param  {Map}     fs   file system
 * @param  {string}  path path to check if is a directory
 * @return {boolean}      true, if the directory exists
 */
export const hasDirectory = (fs: IFileSystem, path: string) => {
  return fs.has(path) && FileUtil.isDirectory(fs.get(path));
};

/**
 * Creates a list of file names
 * @param  {Map}    fs   file system
 * @param  {string} path directory path to list files in
 * @return {object}      list of file names or an error
 */
export const listDirectoryFiles = (
  fs: IFileSystem,
  path: string
): { list: any; err: IEmulatorError | null } => {
  if (hasFile(fs, path)) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path'),
      list: null
    };
  }

  if (!hasDirectory(fs, path)) {
    return {
      err: makeError(
        fsErrorType.NO_SUCH_DIRECTORY,
        'Cannot list files in non-existent directory'
      ),
      list: null
    };
  }

  const filesPattern = path === '/' ? '/*' : `${path}/*`;

  return {
    err: null,
    list: GlobUtil.captureGlobPaths(fs, filesPattern, onlyFilesFilter(fs))
  };
};

/**
 * Creates a list of folder names inside the current directory.
 * @param  {Map}    fs   file system
 * @param  {string} path path to list directories in
 * @return {object}      list of directories or an error
 */
export const listDirectoryFolders = (
  fs: IFileSystem,
  path: string,
  isTrailingSlashAppended = true
): { list: any; err: IEmulatorError | null } => {
  if (hasFile(fs, path)) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path'),
      list: null
    };
  }

  if (!hasDirectory(fs, path)) {
    return {
      err: makeError(
        fsErrorType.NO_SUCH_DIRECTORY,
        'Cannot list folders in non-existent directory'
      ),
      list: null
    };
  }

  const foldersPattern = path === '/' ? '/*' : `${path}/*`;
  const folderNames = GlobUtil.captureGlobPaths(
    fs,
    foldersPattern,
    onlyDirectoriesFilter(fs)
  );

  if (isTrailingSlashAppended) {
    return {
      err: null,
      list: folderNames.map(folderName => `${folderName}/`)
    };
  }

  return {
    err: null,
    list: folderNames
  };
};

/**
 * Lists files and folders in a directory
 * @param  {Map}     fs                                      file system
 * @param  {string}  path                                    directory path to list files and folders in
 * @param  {boolean} [addTrailingSlash=true]                 add a / to the end of folder names
 * @return {object}                                          file system or an error
 */
export const listDirectory = (
  fs: IFileSystem,
  path: string,
  addTrailingSlash = true
) => {
  const { err: listFileErr, list: fileList } = listDirectoryFiles(fs, path);
  const { err: listFolderErr, list: folderList } = listDirectoryFolders(
    fs,
    path,
    addTrailingSlash
  );

  if (listFileErr || listFolderErr) {
    return {
      err: listFileErr ? listFileErr : listFolderErr
    };
  }

  return {
    list: fileList.concat(folderList)
  };
};

/**
 * Adds a directory to the file system
 * @param {Map}     fs                           file system
 * @param {string}  path                         path to add a directory to
 * @param {Map}     dir                          directory
 * @param {boolean} [isReplaceExistingDir=false] whether a directory can be overwritten if it already exists
 * @return {object}                              file system or an error
 */
export const addDirectory = (
  fs: IFileSystem,
  path: string,
  dir: IFileSystem,
  addParentPaths = true
) => {
  if (hasFile(fs, PathUtil.getPathParent(path))) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path'),
      fs: undefined
    };
  }

  return BaseOp.add(fs, path, dir, addParentPaths);
};

/**
 * Private helper function implementing rules for replacing a source path (the path
 * we're copying from) with a destination path (the path we're copying to). Note
 * that in our file system:
 * - A file cannot overwrite a directory,
 * - a directory cannot overwrite a file, and
 * - a file/directory can overwrite a file/directory.
 * @param  {Map}       fs      file system
 * @param  {Sequence}  pathSeq sequence of source and destination paths
 * @return {Boolean}           true, if a source path can replace a destination path
 */
const isPathTypeMatching = (fs: IFileSystem, pathSeq: any) => {
  for (const [srcPath, destPath] of pathSeq) {
    if (fs.has(destPath)) {
      if (hasFile(fs, srcPath) && hasDirectory(fs, destPath)) {
        // Cannot overwrite a file with a directory
        return false;
      } else if (hasDirectory(fs, srcPath) && hasFile(fs, destPath)) {
        // Cannot overwrite a directory with a file
        return false;
      }
    }
  }

  return true;
};

/**
 * Copies a directory (and all directories included inside that directory)
 * from a source directory to a destination directory
 *
 * If the destination doesn't exist, it can be created.
 *
 * The source and destination must be a directory and not a file.
 * @param  {Map}     fs                             file system
 * @param  {string}  srcPath                        directory path to copy from
 * @param  {string}  destPath                       directory path to copy to
 * @return {object}                                 file system or an error
 */
export const copyDirectory = (
  fs: IFileSystem,
  srcPath: string,
  destPath: string,
  overwrite = true
): { fs: IFileSystem | undefined; err: IEmulatorError | undefined } => {
  if (!hasDirectory(fs, srcPath)) {
    return {
      err: makeError(
        fsErrorType.NO_SUCH_DIRECTORY,
        'Source directory does not exist'
      ),
      fs: undefined
    };
  }

  if (!hasDirectory(fs, destPath)) {
    return {
      err: makeError(
        fsErrorType.NO_SUCH_DIRECTORY,
        'Destination directory does not exist'
      ),
      fs: undefined
    };
  }

  const srcChildPattern = srcPath === '/' ? '/**' : `${srcPath}/**`;
  const srcPaths = GlobUtil.globPaths(fs, srcChildPattern);
  const srcSubPaths = GlobUtil.captureGlobPaths(fs, srcChildPattern);
  const destPaths = srcSubPaths.map(
    path => (path === '/' ? destPath : `${destPath}/${path}`)
  );

  if (!isPathTypeMatching(fs, srcPaths.zip(destPaths))) {
    return {
      err: makeError(
        fsErrorType.OTHER,
        'Cannot overwrite a directory with file OR a file with directory'
      ),
      fs: undefined
    };
  }

  return {
    err: undefined,
    fs: fs.withMutations(newFs => {
      for (const [_srcPath, _destPath] of srcPaths.zip(destPaths)) {
        if (!fs.has(_destPath) || overwrite) {
          newFs.set(_destPath, fs.get(_srcPath));
        }
      }
    })
  };
};

/**
 * Remove a directory from a file system
 * @param  {Map}     fs                                   file system
 * @param  {string}  pathToDelete                         directory path to delete
 * @param  {Boolean} [isNonEmptyDirectoryRemovable=false] whether directories with files in them can be removed
 * @return {object}                                       file system or an error
 */
export const deleteDirectory = (
  fs: IFileSystem,
  pathToDelete: string,
  isNonEmptyDirectoryRemovable = false
) => {
  if (hasFile(fs, pathToDelete)) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path'),
      fs: undefined
    };
  }

  if (!hasDirectory(fs, pathToDelete)) {
    return {
      err: makeError(
        fsErrorType.NO_SUCH_DIRECTORY,
        `No such directory: ${pathToDelete}`
      ),
      fs: undefined
    };
  }

  return BaseOp.remove(fs, pathToDelete, isNonEmptyDirectoryRemovable);
};

/**
 * Rename a directory
 * @param  {Map}    fs          file system
 * @param  {string} currentPath directory path to rename (and hence remove)
 * @param  {string} newPath     path to place the renamed directory
 * @return {object}             file system or an error
 */
export const renameDirectory = (
  fs: IFileSystem,
  currentPath: string,
  newPath: string
) => {
  const { err, fs: copiedFS } = copyDirectory(fs, currentPath, newPath, true);

  if (err) {
    return { err };
  }

  return deleteDirectory(
    copiedFS !== undefined ? copiedFS : fs,
    currentPath,
    true
  );
};
