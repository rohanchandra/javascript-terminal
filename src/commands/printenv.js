/**
 * Prints environment variable values
 * Usage: printenv cwd
 */
import parseOptions from 'parser/option-parser';
import * as OutputFactory from 'emulator-output/output-factory';
import { getEnvironmentVariable } from 'emulator-state/environment-variables';

// Converts all key-value pairs of the environment variables to a printable format
const stringifyEnvVariables = (envVariables) => {
  const outputs = envVariables.reduce((outputs, varVal, varKey) => [
    ...outputs, `${varKey}=${varVal}`
  ], []);

  return outputs.join('\n');
};

export const optDef = {};

export default (state, commandOptions) => {
  const {argv} = parseOptions(commandOptions, optDef);
  const envVariables = state.getEnvVariables();

  if (argv.length === 0) {
    return {
      output: OutputFactory.makeTextOutput(stringifyEnvVariables(envVariables))
    };
  }

  // An argument has been passed to printenv; printenv will only print the first
  // argument provided
  const varValue = getEnvironmentVariable(envVariables, argv[0]);

  if (varValue) {
    return {
      output: OutputFactory.makeTextOutput(varValue)
    };
  }

  return {};
};
