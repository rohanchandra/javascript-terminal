/**
 * Changes the current working directory to another directory
 * Usage: cd /newDirectory
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import * as EnvVariableUtil from '../emulator-state/environment-variables';
import { resolvePath } from '../emulator-state/util';
import { fsErrorType, makeError } from '../fs/fs-error';
import * as DirectoryOp from '../fs/operations-with-permissions/directory-operations';
import parseOptions from '../parser/option-parser';

const updateStateCwd = (state: EmulatorState, newCwdPath: string) => {
  return EnvVariableUtil.setEnvironmentVariable(
    state.getEnvVariables(),
    'cwd',
    newCwdPath
  );
};

export const optDef = {};

export default (state: EmulatorState, commandOptions: string[]) => {
  const { argv } = parseOptions(commandOptions, optDef);
  const newCwdPath = argv[0] ? resolvePath(state, argv[0]) : '/';

  if (!DirectoryOp.hasDirectory(state.getFileSystem(), newCwdPath)) {
    const newCwdPathDoesNotExistErr = makeError(fsErrorType.NO_SUCH_DIRECTORY);

    return {
      output: OutputFactory.makeErrorOutput(newCwdPathDoesNotExistErr)
    };
  }

  return {
    state: state.setEnvVariables(updateStateCwd(state, newCwdPath))
  };
};
