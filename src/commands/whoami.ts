/**
 * Prints the username of the logged in user
 * Usage: whoami
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { getEnvironmentVariable } from '../emulator-state/environment-variables';

const FALLBACK_USERNAME = 'root';

export const optDef = {};
export const help = 'Prints who the current user is to the console';
export default (state: EmulatorState, commandOptions: string[]) => {
  return {
    output: OutputFactory.makeTextOutput(
      getEnvironmentVariable(state.getEnvVariables(), 'user') ||
        FALLBACK_USERNAME
    )
  };
};
