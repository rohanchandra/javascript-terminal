/**
 * Emulator error type
 * @type {Object}
 */
export const emulatorErrorType = {
  COMMAND_NOT_FOUND: 'Command not found',
  UNEXPECTED_COMMAND_FAILURE: 'Unhandled command error'
};

/**
 * Creates an error to display to the user originating from the emulator
 * @param  {string} emulatorErrorType  file system error type
 * @param  {string} [message='']       optional metadata for developers about the error
 * @return {object}                    internal error object
 */
export const makeError = (emulatorErrorType, message = '') => {
  return {
    source: 'emulator',
    type: emulatorErrorType,
    message
  };
};
