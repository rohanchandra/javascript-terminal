import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import EmulatorState from 'emulator-state/EmulatorState';
import { create as createEnvironmentVariables } from 'emulator-state/environment-variables';
import pwd from 'commands/pwd';

describe('pwd', () => {
  it('should print the working directory', () => {
    const state = EmulatorState.create({
      environmentVariables: createEnvironmentVariables({}, '/dir')
    });

    const {output} = pwd(state, []);

    chai.expect(output.content).to.equal('/dir');
  });
});
