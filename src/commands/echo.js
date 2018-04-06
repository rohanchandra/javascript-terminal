/**
 * Prints arguments to text output
 * Usage: echo 'hello world'
 */
import * as OutputFactory from 'emulator-output/output-factory';
import { getEnvironmentVariable } from 'emulator-state/environment-variables';

const VARIABLE_GROUP_REGEX = /\$(\w+)/g;
const DOUBLE_SPACE_REGEX = /\s\s+/g;

const substituteEnvVariables = (environmentVariables, inputStr) => {
  return inputStr.replace(VARIABLE_GROUP_REGEX, (match, varName) =>
    getEnvironmentVariable(environmentVariables, varName) || ''
  );
};

export const optDef = {};

export default (state, commandOptions) => {
  const input = commandOptions.join(' ');
  const outputStr = substituteEnvVariables(
    state.getEnvVariables(), input
  );
  const cleanStr = outputStr.trim().replace(DOUBLE_SPACE_REGEX, ' ');

  return {
    output: OutputFactory.makeTextOutput(cleanStr)
  };
};
