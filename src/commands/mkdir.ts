/**
 * Creates an empty directory
 * Usage: mkdir /newDir
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { resolvePath } from '../emulator-state/util';
import * as DirOp from '../fs/operations-with-permissions/directory-operations';
import * as FileUtil from '../fs/util/file-util';
import parseOptions from '../parser/option-parser';
import { IFileSystem } from '../types';

const EMPTY_DIR = FileUtil.makeDirectory();

export const optDef = {};

export default (state: EmulatorState, commandOptions: string[]) => {
  const { argv } = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {}; // do nothing if no arguments are given
  }

  const newFolderPath = resolvePath(state, argv[0]);
  const { fs, err } = DirOp.addDirectory(
    state.getFileSystem(),
    newFolderPath,
    EMPTY_DIR
  );

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(fs as IFileSystem)
  };
};
