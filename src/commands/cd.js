/**
 * Changes the current working directory to another directory
 * Usage: cd /newDirectory
 */
import parseOptions from 'parser/option-parser';
import * as DirectoryOp from 'fs/operations-with-permissions/directory-operations';
import * as EnvVariableUtil from 'emulator-state/environment-variables';
import * as OutputFactory from 'emulator-output/output-factory';
import { makeError, fsErrorType } from 'fs/fs-error';
import { resolvePath } from 'emulator-state/util';

const updateStateCwd = (state, newCwdPath) => {
  return EnvVariableUtil.setEnvironmentVariable(
    state.getEnvVariables(), 'cwd', newCwdPath
  );
};

export const optDef = {};

export default (state, commandOptions) => {
  const {argv} = parseOptions(commandOptions, optDef);
  const newCwdPath = argv[0] ? resolvePath(state, argv[0]) : '/';

  if (!DirectoryOp.hasDirectory(state.getFileSystem(), newCwdPath)) {
    const newCwdPathDoesNotExistErr = makeError(fsErrorType.NO_SUCH_DIRECTORY);

    return {
      output: OutputFactory.makeErrorOutput(newCwdPathDoesNotExistErr)
    };
  }

  return {
    state: state.setEnvVariables(
      updateStateCwd(state, newCwdPath)
    )
  };
};
