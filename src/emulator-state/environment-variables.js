import { Map } from 'immutable';

/**
 * Environment variable mapping containing arbitary data accessed by any
 * command or the emulator as a key-value pair
 * @param  {Object} [defaultVariables={}] default environment variables
 * @return {Map}                          environment variables
 */
export const create = (defaultVariables = {}, cwd = '/') => {
  if (!cwd && !defaultVariables.hasOwnProperty('cwd')) {
    throw new Error(
      "Failed to create environment variables. Missing 'cwd' (current working directory)."
    );
  }

  return Map({
    'cwd': cwd, // cwd can be undefined as it can be set in defaultVariables
    ...defaultVariables
  });
};

/**
 * Gets the value of an environment variable
 * @param  {Map} environmentVariables environment variables
 * @param  {string} key               name of the environment variable
 * @return {T}                        the value stored in the environment variable
 */
export const getEnvironmentVariable = (environmentVariables, key) => {
  return environmentVariables.get(key);
};

/**
 * Sets the value of an environment variable
 * @param {Map} environmentVariables environment variables
 * @param {string} key               name of the environment variable
 * @param {T} val                    value to store in the environment variable
 * @return {Map}                     environment variables
 */
export const setEnvironmentVariable = (environmentVariables, key, val) => {
  return environmentVariables.set(key, val);
};

/**
 * Removes an environment variable
 * @param {Map} environmentVariables environment variables
 * @param {string} key               name of the environment variable
 * @return {Map}                     environment variables
 */
export const unsetEnvironmentVariable = (environmentVariables, key) => {
  return environmentVariables.delete(key);
};
