/**
 * Removes excess whitespace (> 1 space) from edges of string and inside string.
 * @param  {string} str string
 * @return {string}     string without > 1 space of whitespace
 */
const removeExcessWhiteSpace = (str: string) =>
  str.trim().replace(/\s\s+/g, ' ');

/**
 * Places the command name and each following argument into a list
 * @param  {string} command sh command
 * @return {array}          command name and arguments (if any)
 */
const toCommandParts = (command: string) =>
  removeExcessWhiteSpace(command).split(/\s/);

/**
 * Creates a list of commands split into the command name and arguments
 * @param  {string} commands command input
 * @return {array}           list of parsed command
 */
export const parseCommands = (
  commands: string
): Array<{ commandName: string; commandOptions: string[] }> => {
  return commands
    .split(/&&|;/) // split command delimiters: `&&` and `;`
    .map(command => toCommandParts(command))
    .map(([commandName, ...commandOptions]) => ({
      commandName,
      commandOptions
    }));
};

export default parseCommands;
