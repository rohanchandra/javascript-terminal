import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import EmulatorState from 'emulator-state/EmulatorState';
import { create as createEnvironmentVariables } from 'emulator-state/environment-variables';
import printenv from 'commands/printenv';

describe('printenv', () => {
  const state = EmulatorState.create({
    environmentVariables: createEnvironmentVariables({
      'STR': 'baz',
      'NUM': 1337
    }, '/dir')
  });

  it('should print all environment variables when not given any args', () => {
    const {output} = printenv(state, []);

    const expectedCommands = ['cwd=/dir', 'STR=baz', 'NUM=1337'];

    chai.expect(output.content).to.deep.equal(expectedCommands.join('\n'));
  });

  it('should print single environment variable given arg', () => {
    const {output} = printenv(state, ['STR']);

    chai.expect(output.content).to.equal('baz');
  });

  it('should not return any output or state if no env variable with given key', () => {
    chai.expect(printenv(state, ['NO_SUCH_KEY'])).to.deep.equal({});
  });
});
