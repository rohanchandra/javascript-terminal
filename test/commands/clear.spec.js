import chai from '../_plugins/state-equality-plugin';

import EmulatorState from 'emulator-state/EmulatorState';
import { create as createHistory } from 'emulator-state/history';
import * as OutputFactory from 'emulator-output/output-factory';
import clear from 'commands/clear';

describe('clear', () => {
  it('should clear outputs', () => {
    const stateWithOutputs = EmulatorState.create({
      clear: createHistory(OutputFactory.makeTextOutput('a'))
    });

    const {state: actualState} = clear(stateWithOutputs, []);
    const expectedState = EmulatorState.createEmpty();

    chai.expect(actualState).toEqualState(expectedState);
  });
});
