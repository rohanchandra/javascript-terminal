import chai from '../_plugins/state-equality-plugin';

import EmulatorState from 'emulator-state/EmulatorState';
import { create as createFileSystem } from 'emulator-state/file-system';
import { create as createEnvironmentVariables } from 'emulator-state/environment-variables';
import cd from 'commands/cd';

describe('cd', () => {
  const fs = createFileSystem({
    '/': {},
    '/a/subfolder': {},
    '/startingCwd': {}
  });

  const state = EmulatorState.create({
    fs,
    environmentVariables: createEnvironmentVariables({}, '/startingCwd')
  });

  const makeExpectedState = (workingDirectory) => {
    return EmulatorState.create({
      fs,
      environmentVariables: createEnvironmentVariables({}, workingDirectory)
    });
  };

  it('should change working directory to root if no arguments passed to cd', () => {
    const {state: actualState} = cd(state, []);
    const expectedState = makeExpectedState('/');

    chai.expect(actualState).toEqualState(expectedState);
  });

  it('should change working directory to argument directory', () => {
    const {state: actualState} = cd(state, ['/a']);
    const expectedState = makeExpectedState('/a');

    chai.expect(actualState).toEqualState(expectedState);
  });

  it('should change working directory to nested argument directory', () => {
    const {state: actualState} = cd(state, ['/a/subfolder']);
    const expectedState = makeExpectedState('/a/subfolder');

    chai.expect(actualState).toEqualState(expectedState);
  });

  it('should return error output if changing to non-existent directory', () => {
    const {output} = cd(state, ['/no-such-dir']);

    chai.expect(output.type).to.equal('TEXT_ERROR_OUTPUT');
  });
});
