/**
 * Creates an empty file.
 * Usage: touch new_file.txt
 */
import parseOptions from 'parser/option-parser';
import * as FileOp from 'fs/operations-with-permissions/file-operations';
import * as OutputFactory from 'emulator-output/output-factory';
import * as FileUtil from 'fs/util/file-util';
import { resolvePath } from 'emulator-state/util';

const EMPTY_FILE = FileUtil.makeFile();

export const optDef = {};

export default (state, commandOptions) => {
  const {argv} = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {}; // do nothing if no arguments are given
  }

  const filePath = resolvePath(state, argv[0]);

  if (state.getFileSystem().has(filePath)) {
    return {}; // do nothing if already has a file at the provided path
  }

  const {fs, err} = FileOp.writeFile(state.getFileSystem(), filePath, EMPTY_FILE);

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(fs)
  };
};
