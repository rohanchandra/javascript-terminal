import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import { Map } from 'immutable';

chai.use(chaiImmutable);

import EmulatorState from 'emulator-state/EmulatorState';
import { create as createCommandMapping } from 'emulator-state/command-mapping';
import { create as createEnvironmentVariables } from 'emulator-state/environment-variables';
import { create as createFileSystem } from 'emulator-state/file-system';
import { create as createHistory } from 'emulator-state/history';
import { create as createOutputs } from 'emulator-state/outputs';

describe('EmulatorState', () => {
  describe('constructor', () => {
    it('should throw error if not given an immutable data structure', () => {
      chai.expect(() =>
        new EmulatorState({})
      ).to.throw();
    });

    it('should throw error if given an immutable Map', () => {
      // Still not valid emulator state as does not contain the required keys
      // The constructor should only be used internally (does not form part of
      // the API) so no validation of this is OK
      chai.expect(() =>
        new EmulatorState(new Map())
      ).to.not.throw();
    });
  });

  describe('create', () => {
    it('should create state with default components', () => {
      const state = EmulatorState.create({});

      chai.expect(state.getFileSystem()).to.equal(createFileSystem());
      chai.expect(state.getEnvVariables()).to.equal(createEnvironmentVariables());
      chai.expect(state.getHistory()).to.equal(createHistory());
      chai.expect(state.getOutputs()).to.equal(createOutputs());
      chai.expect(state.getCommandMapping()).to.equal(createCommandMapping());
    });

    it('should create state using user defined components', () => {
      const expectedFS = createFileSystem({
        '/files': {}
      });
      const expectedEnvironmentVariables = createEnvironmentVariables({
        'a': 'b'
      }, '/');
      const expectedHistory = createHistory(['a', 'b', 'c']);
      const expectedOutputs = createOutputs();
      const expectedCommandMapping = createCommandMapping({
        'a': {
          function: () => {},
          optDef: {'a': 'd'}
        }
      });

      const state = EmulatorState.create({
        fs: expectedFS,
        environmentVariables: expectedEnvironmentVariables,
        history: expectedHistory,
        outputs: expectedOutputs,
        commandMapping: expectedCommandMapping
      });

      chai.expect(state.getFileSystem()).to.equal(expectedFS);
      chai.expect(state.getEnvVariables()).to.equal(expectedEnvironmentVariables);
      chai.expect(state.getHistory()).to.equal(expectedHistory);
      chai.expect(state.getOutputs()).to.equal(expectedOutputs);
      chai.expect(state.getCommandMapping()).to.equal(expectedCommandMapping);
    });
  });
});
