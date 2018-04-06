import { Map } from 'immutable';
import { create as createCommandMapping } from 'emulator-state/command-mapping';
import { create as createEnvironmentVariables } from 'emulator-state/environment-variables';
import { create as createFileSystem } from 'emulator-state/file-system';
import { create as createHistory } from 'emulator-state/history';
import { create as createOutputs } from 'emulator-state/outputs';

const FS_KEY = 'fs';
const ENVIRONMENT_VARIABLES_KEY = 'environmentVariables';
const HISTORY_KEY = 'history';
const OUTPUTS_KEY = 'outputs';
const COMMAND_MAPPING_KEY = 'commandMapping';

export default class EmulatorState {
  constructor(immutable) {
    if (!immutable || !(immutable instanceof Map)) {
      throw new Error('Do not use the constructor directly. Use the static create method.');
    }

    this._immutable = immutable;
  }

  /**
   * Creates emulator state with defaults
   * @return {EmulatorState} default emulator state
   */
  static createEmpty() {
    return EmulatorState.create({});
  }

  /**
   * Creates emulator state using the user's state components, or a default
   * fallback if none is provided
   * @param  {object} optionally contains each component as a key and the component as a value
   * @return {EmulatorState}     emulator state
   */
  static create({
    fs = createFileSystem(),
    environmentVariables = createEnvironmentVariables(),
    history = createHistory(),
    outputs = createOutputs(),
    commandMapping = createCommandMapping()
  }) {
    const stateMap = new Map({
      [FS_KEY]: fs,
      [ENVIRONMENT_VARIABLES_KEY]: environmentVariables,
      [HISTORY_KEY]: history,
      [OUTPUTS_KEY]: outputs,
      [COMMAND_MAPPING_KEY]: commandMapping
    });

    return new EmulatorState(stateMap);
  }

  getFileSystem() {
    return this.getImmutable().get(FS_KEY);
  }

  setFileSystem(newFileSystem) {
    return new EmulatorState(
      this.getImmutable().set(FS_KEY, newFileSystem)
    );
  }

  getEnvVariables() {
    return this.getImmutable().get(ENVIRONMENT_VARIABLES_KEY);
  }

  setEnvVariables(newEnvVariables) {
    return new EmulatorState(
      this.getImmutable().set(ENVIRONMENT_VARIABLES_KEY, newEnvVariables)
    );
  }

  getHistory() {
    return this.getImmutable().get(HISTORY_KEY);
  }

  setHistory(newHistory) {
    return new EmulatorState(
      this.getImmutable().set(HISTORY_KEY, newHistory)
    );
  }

  getOutputs() {
    return this.getImmutable().get(OUTPUTS_KEY);
  }

  setOutputs(newOutputs) {
    return new EmulatorState(
      this.getImmutable().set(OUTPUTS_KEY, newOutputs)
    );
  }

  getCommandMapping() {
    return this.getImmutable().get(COMMAND_MAPPING_KEY);
  }

  setCommandMapping(newCommandMapping) {
    return new EmulatorState(
      this.getImmutable().set(COMMAND_MAPPING_KEY, newCommandMapping)
    );
  }

  getImmutable() {
    return this._immutable;
  }

  toJS() {
    return this._immutable.toJS();
  }
}
