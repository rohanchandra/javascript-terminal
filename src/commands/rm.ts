/**
 * Removes a directory or a file
 * Usage: rm /existingDir
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { resolvePath } from '../emulator-state/util';
import { fsErrorType, makeError } from '../fs/fs-error';
import * as DirOp from '../fs/operations-with-permissions/directory-operations';
import * as FileOp from '../fs/operations-with-permissions/file-operations';
import parseOptions from '../parser/option-parser';
import { IFileSystem } from '../types';

export const optDef = {
  '--no-preserve-root, --noPreserveRoot': '',
  '-r, --recursive': ''
};

const makeNoPathErrorOutput = () => {
  const noSuchFileOrDirError = makeError(fsErrorType.NO_SUCH_FILE_OR_DIRECTORY);

  return {
    output: OutputFactory.makeErrorOutput(noSuchFileOrDirError)
  };
};

export default (
  state: EmulatorState,
  commandOptions: string[]
): { output?: any; state?: EmulatorState } => {
  const { argv, options } = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {}; // do nothing if no arguments are given
  }

  const deletionPath = resolvePath(state, argv[0]);
  const fs = state.getFileSystem();

  if (deletionPath === '/' && options.noPreserveRoot !== true) {
    return {}; // do nothing as cannot safely delete the root
  }

  if (!fs.has(deletionPath)) {
    return makeNoPathErrorOutput();
  }

  const { fs: deletedPathFS, err } =
    options.recursive === true
      ? DirOp.deleteDirectory(fs, deletionPath, true)
      : FileOp.deleteFile(fs, deletionPath);

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(deletedPathFS as IFileSystem)
  };
};
