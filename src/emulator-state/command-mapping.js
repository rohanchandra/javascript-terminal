import { fromJS } from 'immutable';
import defaultCommandMapping from 'commands';

/**
 * Links a command name to a function
 * @param  {Object} [commandMapping={}] default command map
 * @return {Map}                        command mapping
 */
export const create = (commandMapping = defaultCommandMapping) => {
  for (const commandName of Object.keys(commandMapping)) {
    const command = commandMapping[commandName];

    if (!command.hasOwnProperty('function')) {
      throw new Error(`Failed to create command mapping: missing command function for ${commandName}`);
    }

    if (!command.hasOwnProperty('optDef')) {
      throw new Error(`Failed to create command mapping: missing option definition (optDef) for ${commandName}`);
    }
  }

  return fromJS(commandMapping);
};

/**
 * Checks if a comand has been defined with a function in the command mapping
 * @param  {Map}     commandMapping command mapping
 * @param  {string}  commandName    command name to check if available
 * @return {Boolean}                true, if the command is available
 */
export const isCommandSet = (commandMapping, commandName) => {
  return commandMapping.has(commandName);
};

/**
 * Set a command function with a key of the command name into the command mapping
 * @param  {Map}      commandMapping command mapping
 * @param  {string}   commandName    name of the function
 * @param  {function} commandFn      command function
 * @param  {object}   optDef         option definition (optional)
 * @return {Map}                     command mapping
 */
export const setCommand = (commandMapping, commandName, commandFn, optDef) => {
  if (commandFn === undefined) {
    throw new Error(`Cannot set ${commandName} command without function`);
  }

  if (optDef === undefined) {
    throw new Error(`Cannot set ${commandName} command without optDef (pass in {} if the command takes no options)`);
  }

  return commandMapping.set(commandName, fromJS({
    'function': commandFn,
    'optDef': optDef
  }));
};

/**
 * Removes a command name and its function from a command mapping
 * @param  {Map}    commandMapping command mapping
 * @param  {string} commandName    name of command to remove
 * @return {Map}                   command mapping
 */
export const unsetCommand = (commandMapping, commandName) => {
  return commandMapping.delete(commandName);
};

/**
 * Gets the function of a command based on its command name (the key) from the
 * command mapping
 * @param  {Map}      commandMapping command mapping
 * @param  {string}   commandName    name of command
 * @return {function}                command function
 */
export const getCommandFn = (commandMapping, commandName) => {
  if (commandMapping.has(commandName)) {
    return commandMapping.get(commandName).get('function');
  }

  return undefined;
};

/**
 * Gets the option definition of a command based on its command name
 * @param  {Map}      commandMapping command mapping
 * @param  {string}   commandName    name of command
 * @return {Map}                     option definition
 */
export const getCommandOptDef = (commandMapping, commandName) => {
  if (commandMapping.has(commandName)) {
    return commandMapping.get(commandName).get('optDef');
  }

  return undefined;
};

/**
 * Gets command names
 * @param  {Map}      commandMapping command mapping
 * @return {Seq}                     sequence of command names
 */
export const getCommandNames = (commandMapping) => {
  return commandMapping.keySeq();
};
