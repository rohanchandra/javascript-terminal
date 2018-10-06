/**
 * Adds modification permissions to directory operations by wrapping
 * directory operations
 */
import { fsErrorType, makeError } from '../fs-error';
import * as DirectoryOperations from '../operations/directory-operations';
import * as PermissionUtil from '../util/permission-util';

import { IFileSystem } from '../../types';

const makeDirectoryOperationPermissionError = (
  message = 'Cannot modify directory'
) => {
  return {
    err: makeError(fsErrorType.PERMISSION_DENIED, message),
    fs: undefined
  };
};

export const hasDirectory = (...args: [IFileSystem, string]) => {
  return DirectoryOperations.hasDirectory(...args);
};

export const listDirectory = (...args: [IFileSystem, string]) => {
  return DirectoryOperations.listDirectory(...args);
};

export const listDirectoryFiles = (...args: [IFileSystem, string]) => {
  return DirectoryOperations.listDirectoryFiles(...args);
};

export const listDirectoryFolders = (...args: [IFileSystem, string]) => {
  return DirectoryOperations.listDirectoryFolders(...args);
};

export const addDirectory = (
  fs: IFileSystem,
  path: string,
  ...args: [IFileSystem]
) => {
  if (!PermissionUtil.canModifyPath(fs, path)) {
    return makeDirectoryOperationPermissionError();
  }

  return DirectoryOperations.addDirectory(fs, path, ...args);
};

export const copyDirectory = (
  fs: IFileSystem,
  srcPath: string,
  destPath: string,
  ...args: any[]
) => {
  if (!PermissionUtil.canModifyPath(fs, srcPath)) {
    return makeDirectoryOperationPermissionError(
      'Cannot modify source directory'
    );
  }

  if (!PermissionUtil.canModifyPath(fs, destPath)) {
    return makeDirectoryOperationPermissionError(
      'Cannot modify dest directory'
    );
  }

  return DirectoryOperations.copyDirectory(fs, srcPath, destPath, ...args);
};

export const deleteDirectory = (
  fs: IFileSystem,
  path: string,
  ...args: any[]
) => {
  if (!PermissionUtil.canModifyPath(fs, path)) {
    return makeDirectoryOperationPermissionError();
  }

  return DirectoryOperations.deleteDirectory(fs, path, ...args);
};

export const renameDirectory = (
  fs: IFileSystem,
  currentPath: string,
  newPath: string
) => {
  if (!PermissionUtil.canModifyPath(fs, currentPath)) {
    return makeDirectoryOperationPermissionError('Cannot modify current path');
  }

  if (!PermissionUtil.canModifyPath(fs, newPath)) {
    return makeDirectoryOperationPermissionError('Cannot modify renamed path');
  }

  return DirectoryOperations.renameDirectory(fs, currentPath, newPath);
};
