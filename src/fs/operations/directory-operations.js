import * as FileUtil from 'fs/util/file-util';
import * as GlobUtil from 'fs/util/glob-util';
import * as PathUtil from 'fs/util/path-util';
import * as BaseOp from 'fs/operations/base-operations';
import { makeError, fsErrorType } from 'fs/fs-error';
import { hasFile } from 'fs/operations/file-operations';

const onlyFilesFilter = fs => path => FileUtil.isFile(fs.get(path));
const onlyDirectoriesFilter = fs => path => FileUtil.isDirectory(fs.get(path));

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
export const fillGaps = (fs) => {
  const emptyDirectory = FileUtil.makeDirectory();

  const directoryGapPaths = fs.keySeq() // sequence of paths
    .flatMap(path => PathUtil.getPathBreadCrumbs(path))
    .filter(path => !fs.has(path));

  return fs.withMutations((fs) => {
    for (const directoryGapPath of directoryGapPaths) {
      fs.set(directoryGapPath, emptyDirectory);
    }
  });
};

/**
 * Check if a directory exists in the file system
 * @param  {Map}     fs   file system
 * @param  {string}  path path to check if is a directory
 * @return {boolean}      true, if the directory exists
 */
export const hasDirectory = (fs, path) => {
  return fs.has(path) && FileUtil.isDirectory(fs.get(path));
};

/**
 * Creates a list of file names
 * @param  {Map}    fs   file system
 * @param  {string} path directory path to list files in
 * @return {object}      list of file names or an error
 */
export const listDirectoryFiles = (fs, path) => {
  if (hasFile(fs, path)) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path')
    };
  }

  if (!hasDirectory(fs, path)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_DIRECTORY, 'Cannot list files in non-existent directory')
    };
  };

  const filesPattern = path === '/' ? '/*' : `${path}/*`;

  return {
    list: GlobUtil.captureGlobPaths(fs, filesPattern, onlyFilesFilter(fs))
  };
};

/**
 * Creates a list of folder names inside the current directory.
 * @param  {Map}    fs   file system
 * @param  {string} path path to list directories in
 * @return {object}      list of directories or an error
 */
export const listDirectoryFolders = (fs, path, isTrailingSlashAppended = true) => {
  if (hasFile(fs, path)) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path')
    };
  }

  if (!hasDirectory(fs, path)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_DIRECTORY, 'Cannot list folders in non-existent directory')
    };
  };

  const foldersPattern = path === '/' ? '/*' : `${path}/*`;
  const folderNames = GlobUtil.captureGlobPaths(
    fs, foldersPattern, onlyDirectoriesFilter(fs)
  );

  if (isTrailingSlashAppended) {
    return {
      list: folderNames.map(folderName => `${folderName}/`)
    };
  }

  return {
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
export const listDirectory = (fs, path, addTrailingSlash = true) => {
  const {err: listFileErr, list: fileList} = listDirectoryFiles(fs, path);
  const {err: listFolderErr, list: folderList} = listDirectoryFolders(fs, path, addTrailingSlash);

  if (listFileErr || listFolderErr) {
    return {
      err: listFileErr ? listFileErr : listFolderErr
    };
  };

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
export const addDirectory = (fs, path, dir, addParentPaths = true) => {
  if (hasFile(fs, PathUtil.getPathParent(path))) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path')
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
const isPathTypeMatching = (fs, pathSeq) => {
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
export const copyDirectory = (fs, srcPath, destPath, overwrite = true) => {
  if (!hasDirectory(fs, srcPath)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_DIRECTORY, 'Source directory does not exist')
    };
  };

  if (!hasDirectory(fs, destPath)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_DIRECTORY, 'Destination directory does not exist')
    };
  };

  const srcChildPattern = srcPath === '/' ? '/**' : `${srcPath}/**`;
  const srcPaths = GlobUtil.globPaths(fs, srcChildPattern);
  const srcSubPaths = GlobUtil.captureGlobPaths(fs, srcChildPattern);
  const destPaths = srcSubPaths.map(path => path === '/' ? destPath : `${destPath}/${path}`);

  if (!isPathTypeMatching(fs, srcPaths.zip(destPaths))) {
    return {
      err: makeError(fsErrorType.OTHER, 'Cannot overwrite a directory with file OR a file with directory')
    };
  }

  return {
    fs: fs.withMutations((newFs) => {
      for (const [srcPath, destPath] of srcPaths.zip(destPaths)) {
        if (!fs.has(destPath) || overwrite) {
          newFs.set(destPath, fs.get(srcPath));
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
export const deleteDirectory = (fs, pathToDelete, isNonEmptyDirectoryRemovable = false) => {
  if (hasFile(fs, pathToDelete)) {
    return {
      err: makeError(fsErrorType.FILE_EXISTS, 'File exists at path')
    };
  }

  if (!hasDirectory(fs, pathToDelete)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_DIRECTORY, `No such directory: ${pathToDelete}`)
    };
  };

  return BaseOp.remove(fs, pathToDelete, isNonEmptyDirectoryRemovable);
};

/**
 * Rename a directory
 * @param  {Map}    fs          file system
 * @param  {string} currentPath directory path to rename (and hence remove)
 * @param  {string} newPath     path to place the renamed directory
 * @return {object}             file system or an error
 */
export const renameDirectory = (fs, currentPath, newPath) => {
  const {err, fs: copiedFS} = copyDirectory(fs, currentPath, newPath, true);

  if (err) {
    return {err};
  }

  return deleteDirectory(copiedFS, currentPath, true);
};
