import chai from 'chai';

import {fsErrorType, makeError} from 'fs/fs-error';

describe('fs-error', () => {
  it('should create error object with selected FS error type', () => {
    const fsError = makeError(fsErrorType.NO_SUCH_FILE);

    chai.expect(fsError).to.deep.equal({
      source: 'fs',
      type: fsErrorType.NO_SUCH_FILE,
      message: ''
    });
  });

  it('should create error object with error message', () => {
    const fsError = makeError(fsErrorType.IS_A_DIRECTORY, 'my message');

    chai.expect(fsError).to.deep.equal({
      source: 'fs',
      type: fsErrorType.IS_A_DIRECTORY,
      message: 'my message'
    });
  });
});
