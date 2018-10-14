import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import printenv from '../../src/commands/printenv';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createEnvironmentVariables } from '../../src/emulator-state/environment-variables';

describe('printenv', () => {
  const state = EmulatorState.create({
    environmentVariables: createEnvironmentVariables(
      {
        NUM: 1337,
        STR: 'baz'
      },
      '/dir'
    )
  });

  it('should print all environment variables when not given any args', () => {
    const { output } = printenv(state, []);

    const expectedCommands = ['cwd=/dir', 'NUM=1337', 'STR=baz'];

    chai.expect(output.content).to.deep.equal(expectedCommands.join('\n'));
  });

  it('should print single environment variable given arg', () => {
    const { output } = printenv(state, ['STR']);

    chai.expect(output.content).to.equal('baz');
  });

  it('should not return any output or state if no env variable with given key', () => {
    chai.expect(printenv(state, ['NO_SUCH_KEY'])).to.deep.equal({});
  });
});
