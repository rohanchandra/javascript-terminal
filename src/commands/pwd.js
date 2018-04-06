/**
 * Prints out the current working directory (cwd).
 * Usage: pwd
 */
import * as OutputFactory from 'emulator-output/output-factory';
import { getEnvironmentVariable } from 'emulator-state/environment-variables';

export const optDef = {};

export default (state, commandOptions) => {
  return {
    output: OutputFactory.makeTextOutput(
      getEnvironmentVariable(state.getEnvVariables(), 'cwd')
    )
  };
};
