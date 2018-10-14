import chai from '../_plugins/state-equality-plugin';

import cd from '../../src/commands/cd';
import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createEnvironmentVariables } from '../../src/emulator-state/environment-variables';
import { create as createFileSystem } from '../../src/emulator-state/file-system';

describe('cd', () => {
  const fs = createFileSystem({
    '/': {},
    '/a/subfolder': {},
    '/startingCwd': {}
  });

  const state = EmulatorState.create({
    environmentVariables: createEnvironmentVariables({}, '/startingCwd'),
    fs
  });

  const makeExpectedState = (workingDirectory: string) => {
    return EmulatorState.create({
      environmentVariables: createEnvironmentVariables({}, workingDirectory),
      fs
    });
  };

  it('should change working directory to root if no arguments passed to cd', () => {
    const { state: actualState } = cd(state, []);
    const expectedState = makeExpectedState('/');

    chai.expect(actualState).toEqualState(expectedState);
  });

  it('should change working directory to argument directory', () => {
    const { state: actualState } = cd(state, ['/a']);
    const expectedState = makeExpectedState('/a');

    chai.expect(actualState).toEqualState(expectedState);
  });

  it('should change working directory to nested argument directory', () => {
    const { state: actualState } = cd(state, ['/a/subfolder']);
    const expectedState = makeExpectedState('/a/subfolder');

    chai.expect(actualState).toEqualState(expectedState);
  });

  it('should return error output if changing to non-existent directory', () => {
    const { output } = cd(state, ['/no-such-dir']);

    chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
  });
});
