import chai from '../_plugins/state-equality-plugin';

import touch from '../../src/commands/touch';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createFileSystem } from '../../src/emulator-state/file-system';

describe('touch', () => {
  const emptyState = EmulatorState.createEmpty();
  const stateWithEmptyFile = EmulatorState.create({
    fs: createFileSystem({
      '/': {},
      '/fileName': {
        content: ''
      }
    })
  });

  it('should do nothing if no arguments given', () => {
    const returnVal = touch(emptyState, []);

    chai.expect(returnVal).to.deep.equal({});
  });

  it('should create empty file with given names', () => {
    const { state } = touch(emptyState, ['fileName']);

    chai.expect(state).toEqualState(stateWithEmptyFile);
  });

  it('should create empty file with absolute path', () => {
    const { state } = touch(emptyState, ['/fileName']);

    chai.expect(state).toEqualState(stateWithEmptyFile);
  });

  describe('err: no directory', () => {
    it('should return error output if no directory for file', () => {
      const { output } = touch(emptyState, ['/no-such-dir/fileName']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('err: file already exists', () => {
    it('should NOT modify the fs and return NO error output', () => {
      const returnVal = touch(stateWithEmptyFile, ['fileName']);

      chai.expect(returnVal).to.deep.equal({});
    });
  });
});
