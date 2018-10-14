import chai from '../_plugins/state-equality-plugin';

import rmdir from '../../src/commands/rmdir';
import { makeFileSystemTestState } from './test-helper';

describe('rmdir', () => {
  it('should do nothing if no arguments given', () => {
    // @ts-ignore
    const returnVal = rmdir(makeFileSystemTestState(), []);

    chai.expect(returnVal).to.deep.equal({});
  });

  it('should create remove a directory with a given name', () => {
    const startState = makeFileSystemTestState({
      '/a/b': {}
    });

    const expectedState = makeFileSystemTestState({
      '/a': {}
    });

    const { state } = rmdir(startState, ['/a/b']);

    chai.expect(state).toEqualState(expectedState);
  });

  describe('err: no directory not empty', () => {
    it('should return error output if directory contains folders', () => {
      const startState = makeFileSystemTestState({
        '/a/b': {}
      });

      const { output } = rmdir(startState, ['/a']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });

    it('should return error output if directory contains files', () => {
      const startState = makeFileSystemTestState({
        '/a/b': { content: 'file b content' }
      });

      const { output } = rmdir(startState, ['/a']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('err: no parent directory', () => {
    it('should return error output if no parent directory', () => {
      // @ts-ignore
      const startState = makeFileSystemTestState();

      const { output } = rmdir(startState, ['/noSuchFolder']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });
});
