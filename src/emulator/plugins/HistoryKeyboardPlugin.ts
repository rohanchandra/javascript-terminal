import { Stack } from 'immutable';
import { EmulatorState } from '../../emulator-state';
import BoundedHistoryIterator from './BoundedHistoryIterator';

export default class HistoryKeyboardPlugin {
  _nullableHistoryIterator: BoundedHistoryIterator | null;
  historyStack: Stack<string>;

  constructor(state: EmulatorState) {
    this._nullableHistoryIterator = null;
    this.historyStack = state.getHistory();
  }

  // Plugin contract
  onExecuteStarted(state: EmulatorState, str: string) {
    // no-op
  }

  // Plugin contract
  onExecuteCompleted(state: EmulatorState) {
    this._nullableHistoryIterator = null;
    this.historyStack = state.getHistory();
  }

  // Plugin API
  completeUp(): string {
    this.createHistoryIteratorIfNull();

    return this._nullableHistoryIterator!.up();
  }

  completeDown(): string {
    this.createHistoryIteratorIfNull();

    return this._nullableHistoryIterator!.down() as string;
  }

  // Private methods
  createHistoryIteratorIfNull() {
    if (!this._nullableHistoryIterator) {
      this._nullableHistoryIterator = new BoundedHistoryIterator(
        this.historyStack
      );
    }
  }
}
