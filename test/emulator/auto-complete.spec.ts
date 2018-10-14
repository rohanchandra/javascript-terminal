import chai from 'chai';

import {create as createFileSystem} from 'emulator-state/file-system';
import {create as createCommandMapping} from 'emulator-state/command-mapping';
import {suggestCommands, suggestCommandOptions, suggestFileSystemNames} from 'emulator/auto-complete';

const EMPTY_CMD = {function: () => {}, optDef: {}};

describe('auto-complete', () => {
  describe('suggestCommands', () => {
    it('should suggest all commands if no input', () => {
      const testCmdMapping = createCommandMapping({
        'a': EMPTY_CMD,
        'b': EMPTY_CMD,
        'c': EMPTY_CMD
      });
      const suggestions = suggestCommands(testCmdMapping, '');

      chai.expect(suggestions).to.deep.equal(['a', 'b', 'c']);
    });

    it('should suggest exact match', () => {
      const testCmdMapping = createCommandMapping({
        'cwd': EMPTY_CMD
      });
      const suggestions = suggestCommands(testCmdMapping, 'cwd');

      chai.expect(suggestions).to.deep.equal(['cwd']);
    });

    it('should suggest using partially completed command', () => {
      const testCmdMapping = createCommandMapping({
        'cwd': EMPTY_CMD
      });
      const suggestions = suggestCommands(testCmdMapping, 'cw');

      chai.expect(suggestions).to.deep.equal(['cwd']);
    });

    it('should suggest multiple matches', () => {
      const testCmdMapping = createCommandMapping({
        'quick': EMPTY_CMD,
        'quicklook': EMPTY_CMD,
        'quickoats': EMPTY_CMD,
        'distractor': EMPTY_CMD
      });
      const suggestions = suggestCommands(testCmdMapping, 'quick');

      chai.expect(suggestions).to.deep.equal(['quick', 'quicklook', 'quickoats']);
    });
  });

  describe('suggestCommandOptions', () => {
    it('should suggest all options', () => {
      const testCmdMapping = createCommandMapping({
        'history': {
          function: () => {},
          optDef: {
            '-c, --clear': ''
          }
        }
      });

      const suggestions = suggestCommandOptions(testCmdMapping, 'history', '');

      chai.expect(suggestions).to.deep.equal(['-c', '--clear']);
    });

    it('should suggest all partial option', () => {
      const testCmdMapping = createCommandMapping({
        'history': {
          function: () => {},
          optDef: {
            '-ab': '',
            '-abc': ''
          }
        }
      });

      const suggestions = suggestCommandOptions(testCmdMapping, 'history', '-a');

      chai.expect(suggestions).to.deep.equal(['-ab', '-abc']);
    });

    it('should suggest nothing if no option def', () => {
      const testCmdMapping = createCommandMapping({
        'noOpts': {
          function: () => {},
          optDef: {}
        }
      });

      const suggestions = suggestCommandOptions(testCmdMapping, 'noOpts', '');

      chai.expect(suggestions).to.deep.equal([]);
    });

    it('should suggest nothing if partial input does not match option def', () => {
      const testCmdMapping = createCommandMapping({
        'noOpts': {
          function: () => {},
          optDef: {
            '--match': ''
          }
        }
      });

      const suggestions = suggestCommandOptions(testCmdMapping, 'noOpts', '--noMatch');

      chai.expect(suggestions).to.deep.equal([]);
    });
  });

  describe('suggestFileSystemNames', () => {
    it('should suggest absolute root path names', () => {
      const testFS = createFileSystem({
        '/folder/b/c/d/e/f/g': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/', '/');

      chai.expect(suggestions).to.deep.equal(['/folder']);
    });

    it('should suggest absolute root path names with partial name', () => {
      const testFS = createFileSystem({
        '/folder/b/c/d/e/f/g': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/', '/fol');

      chai.expect(suggestions).to.deep.equal(['/folder']);
    });

    it('should suggest relative root path names', () => {
      const testFS = createFileSystem({
        '/folder/b/c/d/e/f/g': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/', '');

      chai.expect(suggestions).to.deep.equal(['folder']);
    });

    it('should suggest relative root path names with partial name', () => {
      const testFS = createFileSystem({
        '/folder/b/c/d/e/f/g': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/', 'fo');

      chai.expect(suggestions).to.deep.equal(['folder']);
    });

    it('should suggest absolute nested path names', () => {
      const testFS = createFileSystem({
        '/root/b/1': {},
        '/root/b/1/deeply/nested': {},
        '/root/b/2': {},
        '/root/b/3': {},
        '/root/c/4': {},
        '/root/c/5': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/', '/root/b/');

      chai.expect(suggestions).to.deep.equal(['/root/b/1', '/root/b/2', '/root/b/3']);
    });

    it('should suggest absolute nested path names with partial foldername', () => {
      const testFS = createFileSystem({
        '/root/b/partial': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/', '/root/b/par');

      chai.expect(suggestions).to.deep.equal(['/root/b/partial']);
    });

    it('should suggest relative nested path names', () => {
      const testFS = createFileSystem({
        '/root/b/1': {},
        '/root/b/1/deeply/nested': {},
        '/root/b/2': {},
        '/root/b/3': {},
        '/root/c/4': {},
        '/root/c/5': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/root/b', '');

      chai.expect(suggestions).to.deep.equal(['1', '2', '3']);
    });

    it('should suggest relative nested path names with partial foldername', () => {
      const testFS = createFileSystem({
        '/root/b/partial': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/root/b', 'par');

      chai.expect(suggestions).to.deep.equal(['partial']);
    });

    it('should suggest relative nested path names with nested partial foldername', () => {
      const testFS = createFileSystem({
        '/root/b/partial': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/root', 'b/par');

      chai.expect(suggestions).to.deep.equal(['b/partial']);
    });

    it('should suggest nested path names with ..', () => {
      const testFS = createFileSystem({
        '/root/b/1': {},
        '/root/b/1/deeply/nested': {},
        '/root/b/2': {},
        '/root/b/3': {},
        '/root/c/4': {},
        '/root/c/5': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/root/b', '../');

      chai.expect(suggestions).to.deep.equal(['b', 'c']);
    });

    it('should suggest no matches', () => {
      const testFS = createFileSystem({
        '/a': {}
      });
      const suggestions = suggestFileSystemNames(testFS, '/a', '');

      chai.expect(suggestions).to.deep.equal([]);
    });
  });
});
