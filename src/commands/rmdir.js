/**
 * Removes an empty directory
 * Usage: rmdir /emptyDir
 */
import parseOptions from 'parser/option-parser';
import * as DirOp from 'fs/operations-with-permissions/directory-operations';
import * as OutputFactory from 'emulator-output/output-factory';
import { resolvePath } from 'emulator-state/util';

export const optDef = {};

export default (state, commandOptions) => {
  const {argv} = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {}; // do nothing if no arguments are given
  }

  const pathToDelete = resolvePath(state, argv[0]);
  const {fs, err} = DirOp.deleteDirectory(state.getFileSystem(), pathToDelete, false);

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(fs)
  };
};
