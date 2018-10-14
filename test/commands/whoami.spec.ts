import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import whoami from '../../src/commands/whoami';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createEnvironmentVariables } from '../../src/emulator-state/environment-variables';

describe('whoami', () => {
  it('should print root as the fallback usernname', () => {
    const state = EmulatorState.createEmpty();

    const {output} = whoami(state, []);

    chai.expect(output.content).to.equal('root');
  });

  it('should print the user environment variable', () => {
    const state = EmulatorState.create({
      environmentVariables: createEnvironmentVariables({
        'user': 'userNameValue'
      }, '/')
    });

    const {output} = whoami(state, []);

    chai.expect(output.content).to.equal('userNameValue');
  });
});
