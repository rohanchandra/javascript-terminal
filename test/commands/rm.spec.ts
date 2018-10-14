import chai from '../_plugins/state-equality-plugin';

import rm from '../../src/commands/rm';
import { makeFileSystemTestState } from './test-helper';

describe('rm', () => {
  it('should do nothing if no arguments given', () => {
    // @ts-ignore
    const returnVal = rm(makeFileSystemTestState(), []);

    chai.expect(returnVal).to.deep.equal({});
  });

  describe('removing files', () => {
    it('should create remove a file with a given path', () => {
      const startState = makeFileSystemTestState({
        '/a/file': { content: 'file content' }
      });

      const expectedState = makeFileSystemTestState({
        '/a': {}
      });

      const { state } = rm(startState, ['/a/file']);

      chai.expect(state).toEqualState(expectedState);
    });
  });

  describe('removing directories', () => {
    it('should return nothing removing root without no-preserve-root flag', () => {
      const startState = makeFileSystemTestState({
        '/a/b': {}
      });

      const returnVal = rm(startState, ['-r', '/']);

      chai.expect(returnVal).to.deep.equal({});
    });

    it('should create remove root with flag', () => {
      const startState = makeFileSystemTestState({
        '/a/b': {}
      });

      const expectedState = makeFileSystemTestState({});

      const { state } = rm(startState, ['-r', '--no-preserve-root', '/']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should create remove nested directory', () => {
      const startState = makeFileSystemTestState({
        '/a/b': {}
      });

      const expectedState = makeFileSystemTestState({
        '/a': {}
      });

      const { state } = rm(startState, ['-r', '/a/b']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should create remove children directories', () => {
      const startState = makeFileSystemTestState({
        '/delete': {},
        '/delete/baz': {},
        '/delete/baz/bar': {},
        '/delete/foo': {},
        '/doNotDelete/preserveFile': { content: 'should not be removed' }
      });

      const expectedState = makeFileSystemTestState({
        '/doNotDelete/preserveFile': { content: 'should not be removed' }
      });

      const { state } = rm(startState, ['-r', 'delete']);

      chai.expect(state).toEqualState(expectedState);
    });
  });

  describe('err: removing directory without -r flag', () => {
    it('should return error if removing directory without -r flag', () => {
      const startState = makeFileSystemTestState({
        '/a/b': {}
      });

      const { output } = rm(startState, ['/a/b']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('err: no path', () => {
    it('should return error output if no path', () => {
      // @ts-ignore
      const startState = makeFileSystemTestState();

      const { output } = rm(startState, ['/noSuchFolder']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });
});
