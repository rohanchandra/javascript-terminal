import { Stack } from 'immutable';

/**
 * Creates a new history stack of previous commands that have been run in the
 * emulator
 * @param  {array}  [entries=[]] commands which have already been run (if any)
 * @return {Stack}               history list
 */
export const create = (entries = []) => {
  return Stack.of(...entries);
};

/**
 * Stores a command in history in a stack (i.e., the latest command is on top of
 * the history stack)
 * @param  {Stack} history     history
 * @param  {string} commandRun the command to store
 * @return {Stack}             history
 */
export const recordCommand = (history, commandRun) => {
  return history.push(commandRun);
};
