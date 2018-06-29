import * as PathUtil from 'fs/util/path-util';
import * as BaseOp from 'fs/operations/base-operations';
import { isFile } from 'fs/util/file-util';
import { hasDirectory } from 'fs/operations/directory-operations';
import { makeError, fsErrorType } from 'fs/fs-error';

/**
 * Checks whether a file exists
 * @param  {Map}     fs       file system
 * @param  {string}  dirPath  directory of the file to check for existence
 * @param  {string}  fileName file name to check for existence
 * @return {Boolean}          true, if the file exists
 */
export const hasFile = (fs, filePath) => {
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
export const readFile = (fs, filePath) => {
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
export const writeFile = (fs, filePath, file) => {
  return BaseOp.add(fs, filePath, file);
};

/**
 * Copies a file from a source directory to a destination directory
 * @param  {Map}    fs           file system
 * @param  {string} sourcePath   path to source file (to copy from)
 * @param  {string} destPath     path to destination file (to copy to)
 * @return {object}              file system or an error
 */
export const copyFile = (fs, sourcePath, destPath) => {
  if (!hasFile(fs, sourcePath)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_FILE, 'Source file does not exist')
    };
  }

  const pathParent = PathUtil.getPathParent(destPath);

  if (!hasDirectory(fs, pathParent)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_DIRECTORY, 'Destination directory does not exist')
    };
  }

  if (hasDirectory(fs, destPath)) {
    // Copying file to directory without specifying the filename explicitly
    const sourceFileName = PathUtil.getLastPathPart(sourcePath);

    destPath = destPath === '/' ? `/${sourceFileName}` : `${destPath}/${sourceFileName}`;
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
export const deleteFile = (fs, filePath) => {
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

  return BaseOp.remove(fs, filePath);
};
