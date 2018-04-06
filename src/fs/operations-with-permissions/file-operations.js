/**
 * Adds modification permissions to file operations by wrapping
 * file operations
 */
import * as PermissionUtil from 'fs/util/permission-util';
import * as FileOperations from 'fs/operations/file-operations';
import { makeError, fsErrorType } from 'fs/fs-error';

const makeFileOperationPermissionError = (message = 'Cannot modify file') => {
  return {
    err: makeError(fsErrorType.PERMISSION_DENIED, message)
  };
};

export const hasFile = (...args) => {
  return FileOperations.hasFile(...args);
};

export const readFile = (...args) => {
  return FileOperations.readFile(...args);
};

export const writeFile = (fs, filePath, ...args) => {
  if (!PermissionUtil.canModifyPath(fs, filePath)) {
    return makeFileOperationPermissionError();
  }

  return FileOperations.writeFile(fs, filePath, ...args);
};

export const copyFile = (fs, sourcePath, destPath) => {
  if (!PermissionUtil.canModifyPath(fs, sourcePath)) {
    return makeFileOperationPermissionError('Cannot modify source file');
  }

  if (!PermissionUtil.canModifyPath(fs, destPath)) {
    return makeFileOperationPermissionError('Cannot modify destination file');
  }

  return FileOperations.copyFile(fs, sourcePath, destPath);
};

export const deleteFile = (fs, filePath) => {
  if (!PermissionUtil.canModifyPath(fs, filePath)) {
    return makeFileOperationPermissionError();
  }

  return FileOperations.deleteFile(fs, filePath);
};
