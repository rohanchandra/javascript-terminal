/**
 * Prints environment variable values
 * Usage: printenv cwd
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { getEnvironmentVariable } from '../emulator-state/environment-variables';
import parseOptions from '../parser/option-parser';
import { IEnvVars } from '../types';

// Converts all key-value pairs of the environment variables to a printable format
const stringifyEnvVariables = (envVariables: IEnvVars) => {
  const outputs = envVariables.reduce(
    (_outputs: string[], varVal, varKey) => [
      ..._outputs,
      `${varKey}=${varVal}`
    ],
    []
  );

  return outputs.join('\n');
};

export const optDef = {};
export const help = 'Prints all currently set environment variables';
export default (
  state: EmulatorState,
  commandOptions: string[]
): { output?: any } => {
  const { argv } = parseOptions(commandOptions, optDef);
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
