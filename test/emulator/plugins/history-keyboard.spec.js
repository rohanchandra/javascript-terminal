import chai from 'chai';

import HistoryKeyboardPlugin from 'emulator/plugins/HistoryKeyboardPlugin';
import EmulatorState from 'emulator-state/EmulatorState';
import Emulator from 'emulator';

describe('HistoryKeyboardPlugin', () => {
  let historyKeyboardPlugin;
  let emulator;
  let emulatorState;

  beforeEach(() => {
    emulatorState = EmulatorState.createEmpty();
    historyKeyboardPlugin = new HistoryKeyboardPlugin(emulatorState);
    emulator = new Emulator();
  });

  const executeCommand = (commandStr) => {
    emulatorState = emulator.execute(
      emulatorState, commandStr, [historyKeyboardPlugin]
    );
  };

  it('should reset history iterator when command run', () => {
    executeCommand('1');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('1');

    executeCommand('2');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('2');

    executeCommand('3');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('3');
  });

  it('should go up and down to empty string if no commands run', () => {
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('');
    chai.expect(historyKeyboardPlugin.completeDown()).to.equal('');
  });

  it('should go up and down with single command run', () => {
    executeCommand('only command run');

    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('only command run');
    chai.expect(historyKeyboardPlugin.completeDown()).to.equal('');
  });

  it('should go up/down sequence with two commands run', () => {
    executeCommand('1');
    executeCommand('2');

    // up, up, down, down
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('2');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('1');
    chai.expect(historyKeyboardPlugin.completeDown()).to.equal('2');
    chai.expect(historyKeyboardPlugin.completeDown()).to.equal('');
  });

  it('should go up/down interleaved sequence with two commands run', () => {
    executeCommand('1');
    executeCommand('2');

    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('2');
    chai.expect(historyKeyboardPlugin.completeDown()).to.equal('');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('2');
    chai.expect(historyKeyboardPlugin.completeDown()).to.equal('');
  });

  it('should go up and down interleaved sequence with many commands run', () => {
    executeCommand('1');
    executeCommand('2');
    executeCommand('3');
    executeCommand('4');
    executeCommand('5');
    executeCommand('6');

    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('6');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('5');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('4');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('3');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('2');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('1');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('1');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('1');
    chai.expect(historyKeyboardPlugin.completeUp()).to.equal('1');
    chai.expect(historyKeyboardPlugin.completeDown()).to.equal('2');
  });

});
