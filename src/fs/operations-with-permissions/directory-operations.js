/**
 * Adds modification permissions to directory operations by wrapping
 * directory operations
 */
import * as DirectoryOperations from 'fs/operations/directory-operations';
import * as PermissionUtil from 'fs/util/permission-util';
import { makeError, fsErrorType } from 'fs/fs-error';

const makeDirectoryOperationPermissionError = (message = 'Cannot modify directory') => {
  return {
    err: makeError(fsErrorType.PERMISSION_DENIED, message)
  };
};

export const hasDirectory = (...args) => {
  return DirectoryOperations.hasDirectory(...args);
};

export const listDirectory = (...args) => {
  return DirectoryOperations.listDirectory(...args);
};

export const listDirectoryFiles = (...args) => {
  return DirectoryOperations.listDirectoryFiles(...args);
};

export const listDirectoryFolders = (...args) => {
  return DirectoryOperations.listDirectoryFolders(...args);
};

export const addDirectory = (fs, path, ...args) => {
  if (!PermissionUtil.canModifyPath(fs, path)) {
    return makeDirectoryOperationPermissionError();
  }

  return DirectoryOperations.addDirectory(fs, path, ...args);
};

export const copyDirectory = (fs, srcPath, destPath, ...args) => {
  if (!PermissionUtil.canModifyPath(fs, srcPath)) {
    return makeDirectoryOperationPermissionError('Cannot modify source directory');
  }

  if (!PermissionUtil.canModifyPath(fs, destPath)) {
    return makeDirectoryOperationPermissionError('Cannot modify dest directory');
  }

  return DirectoryOperations.copyDirectory(fs, srcPath, destPath, ...args);
};

export const deleteDirectory = (fs, path, ...args) => {
  if (!PermissionUtil.canModifyPath(fs, path)) {
    return makeDirectoryOperationPermissionError();
  }

  return DirectoryOperations.deleteDirectory(fs, path, ...args);
};

export const renameDirectory = (fs, currentPath, newPath) => {
  if (!PermissionUtil.canModifyPath(fs, currentPath)) {
    return makeDirectoryOperationPermissionError('Cannot modify current path');
  }

  if (!PermissionUtil.canModifyPath(fs, newPath)) {
    return makeDirectoryOperationPermissionError('Cannot modify renamed path');
  }

  return DirectoryOperations.renameDirectory(fs, currentPath, newPath);
};
