import getOpts from 'get-options';

/**
 * Creates an options object with bindings based on optDefs
 * @param  {string} commandOptions string representation of command arguments
 * @param  {object} optDef         see get-options documentation for schema details
 * @return {object}                options object
 */
export const parseOptions = (commandOptions, optDef) =>
  getOpts(commandOptions, optDef, {
    noAliasPropagation: 'first-only'
  });

export default parseOptions;
