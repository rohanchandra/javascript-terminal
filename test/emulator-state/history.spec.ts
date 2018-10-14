import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import { Stack } from 'immutable';

chai.use(chaiImmutable);

import * as History from 'emulator-state/history';

describe('history', () => {
  describe('create', () => {
    it('should create an immutable stack', () => {
      const history = History.create([]);

      chai.expect(history).to.be.instanceOf(Stack);
    });

    it('should create command map from JS array', () => {
      const history = History.create([1, 2, 3]);

      chai.expect([...history.values()]).to.deep.equal([1, 2, 3]);
    });
  });

  describe('recordCommand', () => {
    it('should add command to top of stack', () => {
      const history = History.create(['a --help', 'b']);
      const newHistory = History.recordCommand(history, 'new');

      chai.expect(
        newHistory.peek()
      ).to.equal('new');
    });

    it('should keep old commands in stack', () => {
      const history = History.create(['a --help', 'b']);
      const newHistory = History.recordCommand(history, 'new');

      chai.expect(
        newHistory.toJS()
      ).to.deep.equal(['new', 'a --help', 'b']);
    });
  });
});
