import chai from '../_plugins/state-equality-plugin';

import cp from '../../src/commands/cp';
import { makeFileSystemTestState } from './test-helper';

describe('cp', () => {
  describe('copying file to file', () => {
    it('should copy a file to a new file in an existing directory', () => {
      const startState = makeFileSystemTestState({
        '/a': { content: 'a' }
      });

      const expectedState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/newFile': { content: 'a' }
      });

      const { state } = cp(startState, ['a', 'newFile']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should overwrite an existing file', () => {
      const startState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/b': { content: 'b' }
      });

      const expectedState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/b': { content: 'a' }
      });

      const { state } = cp(startState, ['a', 'b']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should return message if copying file to same file', () => {
      const state = makeFileSystemTestState({
        '/file': { content: 'a' }
      });

      const { output } = cp(state, ['file', 'file']);

      chai.expect(output.type).to.equal('TEXT_OUTPUT');
    });
  });

  describe('copying file to directory', () => {
    it('should copy a file to a directory if it exists with a trailing /', () => {
      const startState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder': {}
      });

      const expectedState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder/a': { content: 'a' }
      });

      const { state } = cp(startState, ['a', 'folder/']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should copy a file to a directory if it exists without a trailing /', () => {
      const startState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder': {}
      });

      const expectedState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder/a': { content: 'a' }
      });

      const { state } = cp(startState, ['a', 'folder']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should copy a file to a new file in a directory', () => {
      const startState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder': {}
      });

      const expectedState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder/b': { content: 'a' }
      });

      const { state } = cp(startState, ['a', 'folder/b']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should overwrite an existing file in a directory', () => {
      const startState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder/b': { content: 'b' }
      });

      const expectedState = makeFileSystemTestState({
        '/a': { content: 'a' },
        '/folder/b': { content: 'a' }
      });

      const { state } = cp(startState, ['a', 'folder/b']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should copy a file to the root directory', () => {
      const startState = makeFileSystemTestState({
        '/folder/file': { content: 'file' }
      });

      const expectedState = makeFileSystemTestState({
        '/file': { content: 'file' },
        '/folder/file': { content: 'file' }
      });

      const { state } = cp(startState, ['/folder/file', '/']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should return error output if copying file to non-existent folder', () => {
      const state = makeFileSystemTestState({
        '/file': { content: '' }
      });

      const { output } = cp(state, ['file', 'noSuchDirectory/']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('copying directory to directory', () => {
    it('should copy directory and children to new directory', () => {
      const startState = makeFileSystemTestState({
        '/a': {},
        '/a/b/c': {},
        '/a/b/file': { content: 'content' }
      });

      const expectedState = makeFileSystemTestState({
        '/a': {},
        '/a/b/c': {},
        '/a/b/file': { content: 'content' },
        '/newFolder': {},
        '/newFolder/b/c': {},
        '/newFolder/b/file': { content: 'content' }
      });

      const { state } = cp(startState, ['a', 'newFolder', '-r']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should copy directory and children to subdirectory if directory already exists', () => {
      const startState = makeFileSystemTestState({
        '/a': {},
        '/a/b/c': {},
        '/a/b/file': { content: 'content' },
        '/newFolder': {}
      });

      const expectedState = makeFileSystemTestState({
        '/a': {},
        '/a/b/c': {},
        '/a/b/file': { content: 'content' },
        '/newFolder': {},
        '/newFolder/a': {},
        '/newFolder/a/b/c': {},
        '/newFolder/a/b/file': { content: 'content' }
      });

      const { state } = cp(startState, ['a', 'newFolder', '-r']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should overwrite existing files when copying', () => {
      const startState = makeFileSystemTestState({
        '/a/should-change': { content: 'a' },
        '/b/a/do-not-change': { content: 'do not change' },
        '/b/a/should-change': {
          content: 'should change to contents of /a/should-change'
        }
      });

      const expectedState = makeFileSystemTestState({
        '/a/should-change': { content: 'a' },
        '/b/a/do-not-change': { content: 'do not change' },
        '/b/a/should-change': { content: 'a' }
      });

      const { state } = cp(startState, ['a', 'b', '-r']);

      chai.expect(state).toEqualState(expectedState);
    });

    it('should return error output if copying dir to nested directory', () => {
      const state = makeFileSystemTestState({
        '/dir': {}
      });

      const { output } = cp(state, [
        '/dir',
        '/canMakeFirstLevel/cannotMakeSecondLevel',
        '-r'
      ]);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });

    it('should return error output if copying dir without -r and with trailing /', () => {
      const state = makeFileSystemTestState({
        '/dir': {},
        '/dir2': {}
      });

      const { output } = cp(state, ['dir/', 'dir2/']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });

    it('should return error output if copying dir without -r', () => {
      const state = makeFileSystemTestState({
        '/src': {},
        '/dest': {}
      });

      const { output } = cp(state, ['/src', '/dest']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });

    it('should return message if copying dir to same directory', () => {
      const state = makeFileSystemTestState({
        '/dir': {}
      });

      const { output } = cp(state, ['dir', 'dir', '-r']);

      chai.expect(output.type).to.equal('TEXT_OUTPUT');
    });

    it('should return error output if copying a file to a directory occurs', () => {
      const state = makeFileSystemTestState({
        '/dest/src/mismatched': {}, // folder,
        '/src/mismatched': { content: 'this is a file' }, // file
      });

      const { output } = cp(state, ['/src', '/dest', '-r']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('copying directory to file', () => {
    it('should return error output', () => {
      const state = makeFileSystemTestState({
        '/file': { content: '' },
        '/folder': {}
      });

      const { output } = cp(state, ['/folder', '/file']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('other operations', () => {
    it('should return empty object if not enough arguments are provided', () => {
      // @ts-ignore
      const oneArgReturnVal = cp(makeFileSystemTestState(), ['/folder']);
      // @ts-ignore
      const zeroArgReturnVal = cp(makeFileSystemTestState(), []);

      chai.expect(oneArgReturnVal).to.deep.equal({});
      chai.expect(zeroArgReturnVal).to.deep.equal({});
    });
  });
});
