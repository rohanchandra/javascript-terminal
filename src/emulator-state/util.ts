import * as PathUtil from '../fs/util/path-util';
import EmulatorState from './EmulatorState';
import * as EnvVariableUtil from './environment-variables';

/**
 * Converts a given path to an absolute path using the
 * current working directory
 * @param  {EmulatorState} state emulator state
 * @param  {string} path         path (relative or absolute)
 * @return {string}              absolute path
 */
export const resolvePath = (state: EmulatorState, path: string) => {
  const cwd = EnvVariableUtil.getEnvironmentVariable(
    state.getEnvVariables(),
    'cwd'
  ) as string;

  return PathUtil.toAbsolutePath(path, cwd);
};
