/**
 * Makes a stack iterator for a point in history.
 *
 * Can go backwards and forwards through the history and is bounded by
 * the size of the stack.
 */
export default class BoundedHistoryIterator {
  constructor(historyStack, index = 0) {
    this.historyStack = historyStack.push('');
    this.index = index;
  }

  hasUp() {
    return this.index + 1 < this.historyStack.size;
  }

  up() {
    if (this.hasUp()) {
      this.index++;
    }

    return this.historyStack.get(this.index);
  }

  hasDown() {
    return this.index - 1 >= 0;
  }

  down() {
    if (this.hasDown()) {
      this.index--;
    }

    return this.historyStack.get(this.index);
  }
};
