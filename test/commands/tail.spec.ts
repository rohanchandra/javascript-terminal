import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import tail from '../../src/commands/tail';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createFileSystem } from '../../src/emulator-state/file-system';

const state = EmulatorState.create({
  fs: createFileSystem({
    '/1-line-file': {
      content: '1'
    },
    '/10-line-file': {
      content: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10'
    },
    '/15-line-file': {
      content: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15'
    }
  })
});

describe('tail', () => {
  it('should do nothing if no arguments given', () => {
    const returnVal = tail(state, []);

    chai.expect(returnVal).to.deep.equal({});
  });

  it('print last ten lines by default', () => {
    const { output } = tail(state, ['15-line-file']);

    chai.expect(output.content).to.equal('6\n7\n8\n9\n10\n11\n12\n13\n14\n15');
  });

  it('print last lines in count argument', () => {
    const { output } = tail(state, ['15-line-file', '-n', '2']);

    chai.expect(output.content).to.equal('14\n15');
  });

  it('print maximum number of lines', () => {
    const { output } = tail(state, ['1-line-file', '-n', '1000']);

    chai.expect(output.content).to.equal('1');
  });

  describe('err: no path', () => {
    it('should return error output if no path', () => {
      const { output } = tail(state, ['/noSuchFile']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });
});
