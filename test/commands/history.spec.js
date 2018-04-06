import chai from '../_plugins/state-equality-plugin';

import EmulatorState from 'emulator-state/EmulatorState';
import { create as createHistory } from 'emulator-state/history';
import history from 'commands/history';

describe('history', () => {
  const expectedHistory = ['pwd', 'cd /foo', 'echo abc'];
  const stateWithExpectedHistory = EmulatorState.create({
    history: createHistory(expectedHistory)
  });
  const stateWithNoHistory = EmulatorState.createEmpty();

  it('should print history', () => {
    const {output} = history(stateWithExpectedHistory, []);

    chai.expect(output.content).to.equal(expectedHistory.join('\n'));
  });

  describe('arg: -c', () => {
    it('should delete history', () => {
      const {state} = history(stateWithExpectedHistory, ['-c']);

      chai.expect(state).toEqualState(stateWithNoHistory);
    });
  });
});
