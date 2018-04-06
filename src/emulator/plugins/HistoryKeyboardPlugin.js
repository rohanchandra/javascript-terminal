import BoundedHistoryIterator from 'emulator/plugins/BoundedHistoryIterator';

export default class HistoryKeyboardPlugin {
  constructor(state) {
    this._nullableHistoryIterator = null;
    this.historyStack = state.getHistory();
  }

  // Plugin contract
  onExecuteStarted(state, str) {
    // no-op
  }

  // Plugin contract
  onExecuteCompleted(state) {
    this._nullableHistoryIterator = null;
    this.historyStack = state.getHistory();
  }

  // Plugin API
  completeUp() {
    this.createHistoryIteratorIfNull();

    return this._nullableHistoryIterator.up();
  }

  completeDown() {
    this.createHistoryIteratorIfNull();

    return this._nullableHistoryIterator.down();
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
