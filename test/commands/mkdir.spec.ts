import chai from '../_plugins/state-equality-plugin';

import mkdir from '../../src/commands/mkdir';
import { makeFileSystemTestState } from './test-helper';

describe('mkdir', () => {
  it('should do nothing if no arguments given', () => {
    // @ts-ignore
    const returnVal = mkdir(makeFileSystemTestState(), []);

    chai.expect(returnVal).to.deep.equal({});
  });

  it('should create directory in root with given name', () => {
    const expectedState = makeFileSystemTestState({
      '/newFolderName': {}
    });

    // @ts-ignore
    const {state} = mkdir(makeFileSystemTestState(), ['newFolderName']);

    chai.expect(state).toEqualState(expectedState);
  });

  it('should create nested directory with given name', () => {
    const startState = makeFileSystemTestState({
      '/a/b': {}
    });

    const expectedState = makeFileSystemTestState({
      '/a/b/c': {}
    });

    const {state} = mkdir(startState, ['/a/b/c']);

    chai.expect(state).toEqualState(expectedState);
  });

  describe('err: no parent directory', () => {
    it('should return error output if no parent directory', () => {
      // @ts-ignore
      const startState = makeFileSystemTestState();

      const {output} = mkdir(startState, ['/new/folder/here']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });
});
