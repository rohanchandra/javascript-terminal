import { EmulatorErrorType, IEmulatorError } from '../types';

/**
 * Emulator error type
 * @type {Object}
 */
export enum emulatorErrorType {
  COMMAND_NOT_FOUND = 'Command not found',
  UNEXPECTED_COMMAND_FAILURE = 'Unhandled command error'
}

/**
 * Creates an error to display to the user originating from the emulator
 * @param  {string} emulatorErrorString  file system error type
 * @param  {string} [message='']       optional metadata for developers about the error
 * @return {object}                    internal error object
 */
export const makeError = (
  emulatorErrorString: EmulatorErrorType,
  message = ''
): IEmulatorError => {
  return {
    message,
    source: 'emulator',
    type: emulatorErrorString
  };
};
