/**
 * Combines one or more files to display in the terminal output
 * Usage: cat file1.txt file2.txt
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { resolvePath } from '../emulator-state/util';
import * as FileOp from '../fs/operations-with-permissions/file-operations';
import parseOptions from '../parser/option-parser';
import { IFileSystem } from '../types';

const fileToTextOutput = (fs: IFileSystem, filePath: string) => {
  const { err, file } = FileOp.readFile(fs, filePath);

  if (err) {
    return OutputFactory.makeErrorOutput(err);
  }

  return OutputFactory.makeTextOutput(file.get('content'));
};

export const optDef = {};

export default (state: EmulatorState, commandOptions: string[]) => {
  const { argv } = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {};
  }

  const filePaths = argv.map((pathArg: string) => resolvePath(state, pathArg));

  return {
    outputs: filePaths.map((path: string) =>
      fileToTextOutput(state.getFileSystem(), path)
    )
  };
};
