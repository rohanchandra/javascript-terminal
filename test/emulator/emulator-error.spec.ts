import chai from 'chai';

import {emulatorErrorType, makeError} from 'emulator/emulator-error';

describe('emulator/emulator-error', () => {
  it('should create error object with selected emulator error type', () => {
    const emulatorError = makeError(emulatorErrorType.COMMAND_NOT_FOUND);

    chai.expect(emulatorError).to.deep.equal({
      source: 'emulator',
      type: emulatorErrorType.COMMAND_NOT_FOUND,
      message: ''
    });
  });

  it('should create error object with error message', () => {
    const emulatorError = makeError(emulatorErrorType.UNEXPECTED_COMMAND_FAILURE, 'my message');

    chai.expect(emulatorError).to.deep.equal({
      source: 'emulator',
      type: emulatorErrorType.UNEXPECTED_COMMAND_FAILURE,
      message: 'my message'
    });
  });
});
