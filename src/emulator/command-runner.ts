import { makeErrorOutput } from '../emulator-output/output-factory';
import * as CommandMappingUtil from '../emulator-state/command-mapping';
import EmulatorState from '../emulator-state/EmulatorState';
import { emulatorErrorType, makeError } from './emulator-error';

import { EmulatorErrorType, ICommandMapping } from '../types';

/**
 * Makes an internal emulator error for emulator output. Error output may be
 * visible to the user.
 * @param  {string} errorType type of emulator error
 * @return {object}           error output object
 */
const makeRunnerErrorOutput = (errorType: EmulatorErrorType) => {
  return makeErrorOutput(makeError(errorType));
};

/**
 * Runs a command and returns an object containing either:
 * - outputs from running the command, or
 * - new emulator state after running the command, or
 * - new emulator state and output after running the command
 *
 * The form of the object from this function is as follows:
 * {
 *   outputs: [optional array of output records]
 *   output: [optional single output record]
 *   state: [optional Map]
 * }
 * @param  {Map}    commandMapping command mapping from emulator state
 * @param  {string} commandName    name of command to run
 * @param  {array}  commandArgs    commands to provide to the command function
 * @param {function} defaultCommand Checks if there is a command named "default" and runs that if command not found
 * @return {object}                outputs and/or new state of the emulator
 */
export const run = async (
  commandMapping: ICommandMapping,
  commandName: string,
  commandArgs: [EmulatorState, string[]],
  defaultCommand = CommandMappingUtil.getCommandFn(commandMapping, 'default')
) => {
  if (!CommandMappingUtil.isCommandSet(commandMapping, commandName)) {
    if (defaultCommand) {
      // If it's the default command add the command name in as the first opts
      commandArgs[1].unshift(commandName);
      return await defaultCommand(...commandArgs);
    }
    return {
      output: makeRunnerErrorOutput(emulatorErrorType.COMMAND_NOT_FOUND)
    };
  }

  const command = CommandMappingUtil.getCommandFn(commandMapping, commandName);

  try {
    return await command(...commandArgs); // run extracted command from the mapping
  } catch (fatalCommandError) {
    return {
      output: makeRunnerErrorOutput(
        emulatorErrorType.UNEXPECTED_COMMAND_FAILURE
      )
    };
  }
};
