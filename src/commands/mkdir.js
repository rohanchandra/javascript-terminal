/**
 * Creates an empty directory
 * Usage: mkdir /newDir
 */
import parseOptions from 'parser/option-parser';
import * as DirOp from 'fs/operations-with-permissions/directory-operations';
import * as OutputFactory from 'emulator-output/output-factory';
import * as FileUtil from 'fs/util/file-util';
import { resolvePath } from 'emulator-state/util';

const EMPTY_DIR = FileUtil.makeDirectory();

export const optDef = {};

export default (state, commandOptions) => {
  const {argv} = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {}; // do nothing if no arguments are given
  }

  const newFolderPath = resolvePath(state, argv[0]);
  const {fs, err} = DirOp.addDirectory(state.getFileSystem(), newFolderPath, EMPTY_DIR, false);

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(fs)
  };
};
