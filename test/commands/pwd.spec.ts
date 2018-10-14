import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import pwd from '../../src/commands/pwd';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createEnvironmentVariables } from '../../src/emulator-state/environment-variables';

describe('pwd', () => {
  it('should print the working directory', () => {
    const state = EmulatorState.create({
      environmentVariables: createEnvironmentVariables({}, '/dir')
    });

    const { output } = pwd(state, []);

    chai.expect(output.content).to.equal('/dir');
  });
});
