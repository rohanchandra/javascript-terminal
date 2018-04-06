/**
 * Prints the username of the logged in user
 * Usage: whoami
 */
import * as OutputFactory from 'emulator-output/output-factory';
import { getEnvironmentVariable } from 'emulator-state/environment-variables';

const FALLBACK_USERNAME = 'root';

export const optDef = {};

export default (state, commandOptions) => {
  return {
    output: OutputFactory.makeTextOutput(
      getEnvironmentVariable(state.getEnvVariables(), 'user') || FALLBACK_USERNAME
    )
  };
};
