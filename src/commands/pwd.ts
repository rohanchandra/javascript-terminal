/**
 * Prints out the current working directory (cwd).
 * Usage: pwd
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { getEnvironmentVariable } from '../emulator-state/environment-variables';

export const optDef = {};

export default (state: EmulatorState, commandOptions: string[]) => {
  return {
    output: OutputFactory.makeTextOutput(getEnvironmentVariable(
      state.getEnvVariables(),
      'cwd'
    ) as string)
  };
};
