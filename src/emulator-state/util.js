import * as EnvVariableUtil from 'emulator-state/environment-variables';
import * as PathUtil from 'fs/util/path-util';

/**
 * Converts a given path to an absolute path using the
 * current working directory
 * @param  {EmulatorState} state emulator state
 * @param  {string} path         path (relative or absolute)
 * @return {string}              absolute path
 */
export const resolvePath = (state, path) => {
  const cwd = EnvVariableUtil.getEnvironmentVariable(
    state.getEnvVariables(), 'cwd'
  );

  return PathUtil.toAbsolutePath(path, cwd);
};
