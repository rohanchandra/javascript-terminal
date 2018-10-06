/**
 * Adds modification permissions to file operations by wrapping
 * file operations
 */
import { fsErrorType, makeError } from '../fs-error';
import * as FileOperations from '../operations/file-operations';
import * as PermissionUtil from '../util/permission-util';

import {IFileSystem} from "../../types";

const makeFileOperationPermissionError = (message = 'Cannot modify file') => {
  return {
    err: makeError(fsErrorType.PERMISSION_DENIED, message),
    fs: undefined
  };
};

export const hasFile = (args: [IFileSystem, string]) => {
  return FileOperations.hasFile(...args);
};

export const readFile = (...args: [IFileSystem, string]) => {
  return FileOperations.readFile(...args);
};

export const writeFile = (fs: IFileSystem, filePath: string, ...args: [IFileSystem]) => {
  if (!PermissionUtil.canModifyPath(fs, filePath)) {
    return makeFileOperationPermissionError();
  }

  return FileOperations.writeFile(fs, filePath, ...args);
};

export const copyFile = (fs: IFileSystem, sourcePath: string, destPath: string) => {
  if (!PermissionUtil.canModifyPath(fs, sourcePath)) {
    return makeFileOperationPermissionError('Cannot modify source file');
  }

  if (!PermissionUtil.canModifyPath(fs, destPath)) {
    return makeFileOperationPermissionError('Cannot modify destination file');
  }

  return FileOperations.copyFile(fs, sourcePath, destPath);
};

export const deleteFile = (fs: IFileSystem, filePath: string) => {
  if (!PermissionUtil.canModifyPath(fs, filePath)) {
    return makeFileOperationPermissionError();
  }

  return FileOperations.deleteFile(fs, filePath);
};
