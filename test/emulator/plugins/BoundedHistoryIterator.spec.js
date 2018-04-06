import chai from 'chai';

import BoundedHistoryIterator from 'emulator/plugins/BoundedHistoryIterator';
import { create as createHistory } from 'emulator-state/history';

describe('BoundedHistoryIterator', () => {
  it('should go up until last value', () => {
    const iterator = new BoundedHistoryIterator(createHistory([1, 2, 3]));

    chai.expect(iterator.up()).to.equal(1);
    chai.expect(iterator.up()).to.equal(2);
    chai.expect(iterator.up()).to.equal(3);
    chai.expect(iterator.up()).to.equal(3);
    chai.expect(iterator.up()).to.equal(3);
  });

  it('should go down/up with empty history', () => {
    const iterator = new BoundedHistoryIterator(createHistory([]));

    chai.expect(iterator.down()).to.equal('');
    chai.expect(iterator.up()).to.equal('');
  });

  it('should go down with empty history', () => {
    const iterator = new BoundedHistoryIterator(createHistory([]));

    chai.expect(iterator.down()).to.equal('');
    chai.expect(iterator.down()).to.equal('');
    chai.expect(iterator.down()).to.equal('');
  });

  it('should go up with empty history', () => {
    const iterator = new BoundedHistoryIterator(createHistory([]));

    chai.expect(iterator.up()).to.equal('');
    chai.expect(iterator.up()).to.equal('');
    chai.expect(iterator.up()).to.equal('');
  });

  it('should go down until empty string', () => {
    const iterator = new BoundedHistoryIterator(createHistory([1, 2, 3]), 3);

    chai.expect(iterator.down()).to.equal(2);
    chai.expect(iterator.down()).to.equal(1);
    chai.expect(iterator.down()).to.equal('');
  });

  it('should go down and up', () => {
    const iterator = new BoundedHistoryIterator(createHistory([1, 2, 3, 4, 5]));

    // up sequence
    chai.expect(iterator.up()).to.equal(1);
    chai.expect(iterator.up()).to.equal(2);
    chai.expect(iterator.up()).to.equal(3);
    chai.expect(iterator.up()).to.equal(4);
    chai.expect(iterator.up()).to.equal(5);

    // down sequence
    chai.expect(iterator.down()).to.equal(4);
    chai.expect(iterator.down()).to.equal(3);
    chai.expect(iterator.down()).to.equal(2);
    chai.expect(iterator.down()).to.equal(1);

    // extra down sequence
    chai.expect(iterator.down()).to.equal('');
    chai.expect(iterator.down()).to.equal('');

    // up sequence
    chai.expect(iterator.up()).to.equal(1);
    chai.expect(iterator.up()).to.equal(2);
    chai.expect(iterator.up()).to.equal(3);
    chai.expect(iterator.up()).to.equal(4);
    chai.expect(iterator.up()).to.equal(5);

    // extra up sequence
    chai.expect(iterator.up()).to.equal(5);
    chai.expect(iterator.up()).to.equal(5);

    // up/down sequence
    chai.expect(iterator.down()).to.equal(4);
    chai.expect(iterator.down()).to.equal(3);
    chai.expect(iterator.up()).to.equal(4);
    chai.expect(iterator.up()).to.equal(5);
    chai.expect(iterator.down()).to.equal(4);
  });
});
