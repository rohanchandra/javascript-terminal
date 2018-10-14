import chai from '../_plugins/state-equality-plugin';

import clear from '../../src/commands/clear';
import * as OutputFactory from '../../src/emulator-output/output-factory';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createHistory } from '../../src/emulator-state/history';

describe('clear', () => {
  it('should clear outputs', () => {
    const stateWithOutputs = EmulatorState.create({
      history: createHistory(OutputFactory.makeTextOutput('a'))
    });

    const { state: actualState } = clear(stateWithOutputs, []);
    const expectedState = EmulatorState.createEmpty();

    chai.expect(actualState).toEqualState(expectedState);
  });
});
