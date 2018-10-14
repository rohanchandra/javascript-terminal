import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import cat from '../../src/commands/cat';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createFileSystem } from '../../src/emulator-state/file-system';

const state = EmulatorState.create({
  fs: createFileSystem({
    '/': {},
    '/a': {
      content: 'file-one-content\nline-two'
    },
    '/b': {
      content: 'file-two-content'
    },
    '/directory': {}
  })
});

describe('cat', () => {
  it('print out single file', () => {
    const { outputs } = cat(state, ['a']);

    chai.expect(outputs[0].content).to.equal('file-one-content\nline-two');
  });

  it('should join multiple files ', () => {
    const { outputs } = cat(state, ['a', 'b']);

    chai.expect(outputs[0].content).to.equal('file-one-content\nline-two');
    chai.expect(outputs[1].content).to.equal('file-two-content');
  });

  it('should have no output if no file is given', () => {
    const { outputs } = cat(state, []);

    chai.expect(outputs).to.equal(undefined);
  });

  describe('err: no directory', () => {
    it('should return error output', () => {
      const { outputs } = cat(state, ['/no/such/dir/file.txt']);

      chai.expect(outputs[0].type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('err: no file', () => {
    it('should read files which exist and skip files with error', () => {
      const { outputs } = cat(state, ['a', 'no-such-file', 'b']);

      chai.expect(outputs[0].content).to.equal('file-one-content\nline-two');
      chai.expect(outputs[1].type).to.equal('TEXT_ERROR_OUTPUT');
      chai.expect(outputs[2].content).to.equal('file-two-content');
    });

    it('should return error output if no file', () => {
      const { outputs } = cat(state, ['/no_such_file.txt']);

      chai.expect(outputs[0].type).to.equal('TEXT_ERROR_OUTPUT');
    });

    it('should return error output if directory instead of file is passed to cat', () => {
      const { outputs } = cat(state, ['/directory']);

      chai.expect(outputs[0].type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });
});
