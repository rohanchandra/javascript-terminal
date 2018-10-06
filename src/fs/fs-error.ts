/**
 * File system error types
 * @type {Object}
 */
import { EmulatorErrorType, IEmulatorError } from '../types';

export enum fsErrorType {
  FILE_EXISTS = 'File exists',
  DIRECTORY_EXISTS = 'Directory exists',
  DIRECTORY_NOT_EMPTY = 'Directory not empty',
  NO_SUCH_FILE_OR_DIRECTORY = 'No such file or directory',
  NO_SUCH_FILE = 'No such file',
  NO_SUCH_DIRECTORY = 'No such directory',
  FILE_OR_DIRECTORY_EXISTS = 'File or directory exists',
  IS_A_DIRECTORY = 'Is a directory',
  NOT_A_DIRECTORY = 'Not a directory',
  PERMISSION_DENIED = 'Permission denied',
  OTHER = 'Other'
};

/**
 * Create a non-fatal file system error object
 *
 * For fatal errors do not use this. Throw an error instead.
 * @param  {string} _fsErrorType  file system error type
 * @param  {string} [message=''] optional metadata for developers about the error
 * @return {object}              internal error object
 */
export const makeError = (
  _fsErrorType: EmulatorErrorType,
  message = ''
): IEmulatorError => {
  return {
    message,
    source: 'fs',
    type: _fsErrorType
  };
};
