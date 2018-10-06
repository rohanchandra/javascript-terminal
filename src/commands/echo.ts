/**
 * Prints arguments to text output
 * Usage: echo 'hello world'
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { getEnvironmentVariable } from '../emulator-state/environment-variables';
import { IEnvVars } from '../types';

const VARIABLE_GROUP_REGEX = /\$(\w+)/g;
const DOUBLE_SPACE_REGEX = /\s\s+/g;

const substituteEnvVariables = (
  environmentVariables: IEnvVars,
  inputStr: string
) => {
  return inputStr.replace(
    VARIABLE_GROUP_REGEX,
    (match, varName) =>
      getEnvironmentVariable(environmentVariables, varName) || ''
  );
};

export const optDef = {};
export const help = 'Prints some output to the console';

export default (state: EmulatorState, commandOptions: string[]) => {
  const input = commandOptions.join(' ');
  const outputStr = substituteEnvVariables(state.getEnvVariables(), input);
  const cleanStr = outputStr.trim().replace(DOUBLE_SPACE_REGEX, ' ');

  return {
    output: OutputFactory.makeTextOutput(cleanStr)
  };
};
