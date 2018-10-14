import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import ls from '../../src/commands/ls';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createFileSystem } from '../../src/emulator-state/file-system';

const state = EmulatorState.create({
  fs: createFileSystem({
    '/': {},
    '/.hidden.txt': {
      content: ''
    },
    '/a.txt': {
      content: ''
    },
    '/a/subfolder': {},
    '/a/subfolder/c.txt': {
      content: ''
    },
    '/a/subfolder/d.txt': {
      content: ''
    },
    '/b.txt': {
      content: ''
    },
    '/emptyFolder': {}
  })
});

describe('ls', () => {
  it('should list folders and files in root: /', () => {
    const { output } = ls(state, ['/']);
    const expectedListing = ['a.txt', 'a/', 'b.txt', 'emptyFolder/'].join('\n');

    chai.expect(output.content).to.equal(expectedListing);
  });

  it('should list folders and files in cwd if no argument', () => {
    const { output } = ls(state, []);
    const expectedListing = ['a.txt', 'a/', 'b.txt', 'emptyFolder/'].join('\n');

    chai.expect(output.content).to.equal(expectedListing);
  });

  it('should list files in subfolder folder', () => {
    const { output } = ls(state, ['/a/subfolder']);
    const expectedListing = ['c.txt', 'd.txt'].join('\n');

    chai.expect(output.content).to.equal(expectedListing);
  });

  it('should list no files in empty folder', () => {
    const { output } = ls(state, ['/emptyFolder']);

    chai.expect(output.content).to.equal('');
  });

  describe('err: no directory', () => {
    it('should return error output', () => {
      const { output } = ls(state, ['/no/such/dir']);

      chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
    });
  });

  describe('arg: -a', () => {
    it('should list hidden files/folders, implied directories (. and ..), visible files/folders', () => {
      const { output } = ls(state, ['/', '-a']);
      const expectedListing = [
        '.',
        '..',
        '.hidden.txt',
        'a.txt',
        'a/',
        'b.txt',
        'emptyFolder/'
      ].join('\n');

      chai.expect(output.content).to.equal(expectedListing);
    });
  });

  describe('arg: -A', () => {
    it('should list hidden and visible files/folders', () => {
      const { output } = ls(state, ['/', '-A']);
      const expectedListing = [
        '.hidden.txt',
        'a.txt',
        'a/',
        'b.txt',
        'emptyFolder/'
      ].join('\n');

      chai.expect(output.content).to.equal(expectedListing);
    });
  });
});
