import { fsErrorType, makeError } from '../fs-error';
import * as BaseOp from '../operations/base-operations';
import { isFile } from '../util/file-util';
import * as PathUtil from '../util/path-util';
import { hasDirectory } from './directory-operations';

import { IFileSystem } from '../../types';

/**
 * Checks whether a file exists
 * @param  {Map}     fs       file system
 * @param  {string}  filePath file name to check for existence
 * @return {Boolean}          true, if the file exists
 */
export const hasFile = (fs: IFileSystem, filePath: string) => {
  if (fs.has(filePath)) {
    const possibleFile = fs.get(filePath);

    return isFile(possibleFile);
  }
  return false;
};

/**
 * Get a file from the file system
 * @param  {Map}    fs       file system
 * @param  {string} filePath path to file to read
 * @return {object}          file system or an error
 */
export const readFile = (fs: IFileSystem, filePath: string) => {
  if (hasDirectory(fs, filePath)) {
    return {
      err: makeError(fsErrorType.IS_A_DIRECTORY)
    };
  }

  if (!hasFile(fs, filePath)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_FILE)
    };
  }

  return {
    file: fs.get(filePath)
  };
};

/**
 * Write a new file to the file system
 * @param  {Map}     fs                            file system
 * @param  {string}  filePath                      path to new file
 * @param  {Map}     file                          the new file
 * @return {object}                                file system or an error
 */
export const writeFile = (
  fs: IFileSystem,
  filePath: string,
  file: IFileSystem
) => {
  return BaseOp.add(fs, filePath, file);
};

/**
 * Copies a file from a source directory to a destination directory
 * @param  {Map}    fs           file system
 * @param  {string} sourcePath   path to source file (to copy from)
 * @param  {string} destPath     path to destination file (to copy to)
 * @return {object}              file system or an error
 */
export const copyFile = (
  fs: IFileSystem,
  sourcePath: string,
  destPath: string
) => {
  if (!hasFile(fs, sourcePath)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_FILE, 'Source file does not exist')
    };
  }

  const pathParent = PathUtil.getPathParent(destPath);

  if (!hasDirectory(fs, pathParent)) {
    return {
      err: makeError(
        fsErrorType.NO_SUCH_DIRECTORY,
        'Destination directory does not exist'
      )
    };
  }

  if (hasDirectory(fs, destPath)) {
    // Copying file to directory without specifying the filename explicitly
    const sourceFileName = PathUtil.getLastPathPart(sourcePath);

    destPath =
      destPath === '/' ? `/${sourceFileName}` : `${destPath}/${sourceFileName}`;
  }

  return {
    fs: fs.set(destPath, fs.get(sourcePath))
  };
};

/**
 * Removes a file from the file system
 * @param  {Map}    fs       file system
 * @param  {string} filePath path to the file to delete
 * @return {object}          file system or an error
 */
export const deleteFile = (fs: IFileSystem, filePath: string) => {
  if (hasDirectory(fs, filePath)) {
    return {
      err: makeError(fsErrorType.IS_A_DIRECTORY),
      fs: undefined
    };
  }

  if (!hasFile(fs, filePath)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_FILE),
      fs: undefined
    };
  }

  return BaseOp.remove(fs, filePath);
};
