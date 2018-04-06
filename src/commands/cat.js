/**
 * Combines one or more files to display in the terminal output
 * Usage: cat file1.txt file2.txt
 */
import parseOptions from 'parser/option-parser';
import * as FileOp from 'fs/operations-with-permissions/file-operations';
import * as OutputFactory from 'emulator-output/output-factory';
import { resolvePath } from 'emulator-state/util';

const fileToTextOutput = (fs, filePath) => {
  const {err, file} = FileOp.readFile(fs, filePath);

  if (err) {
    return OutputFactory.makeErrorOutput(err);
  };

  return OutputFactory.makeTextOutput(file.get('content'));
};

export const optDef = {};

export default (state, commandOptions) => {
  const {argv} = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {};
  }

  const filePaths = argv.map(pathArg => resolvePath(state, pathArg));

  return {
    outputs: filePaths.map(path => fileToTextOutput(state.getFileSystem(), path))
  };
};
