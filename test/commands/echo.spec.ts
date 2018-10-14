import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createEnvironmentVariables } from '../../src/emulator-state/environment-variables';
import echo from '../../src/commands/echo';

describe('echo', () => {
  const state = EmulatorState.create({
    environmentVariables: createEnvironmentVariables({
      'STR': 'baz'
    }, '/dir')
  });

  it('should echo string', () => {
    const {output} = echo(state, ['hello', 'world']);

    chai.expect(output.content).to.equal('hello world');
  });

  it('should replace variable in string with value', () => {
    const {output} = echo(state, ['this', 'is', '$STR']);

    chai.expect(output.content).to.equal('this is baz');
  });

  it('should replace variable with value', () => {
    const {output} = echo(state, ['$STR']);

    chai.expect(output.content).to.equal('baz');
  });

  it('should replace missing variable with no value', () => {
    const {output} = echo(state, ['val', '$NO_SUCH_VAR']);

    chai.expect(output.content).to.equal('val');
  });
});
