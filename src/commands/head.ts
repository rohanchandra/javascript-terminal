/**
 * Prints the first n lines of a file
 * Usage: head -n 5 file.txt
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { resolvePath } from '../emulator-state/util';
import parseOptions from '../parser/option-parser';
import { trimFileContent } from './util/_head_tail_util';

export const optDef = {
  '-n, --lines': '<count>'
};

export default (state: EmulatorState, commandOptions: string[]) => {
  const { argv, options } = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {};
  }

  const filePath = resolvePath(state, argv[0]);
  const headTrimmingFn = (lines: string[], lineCount: number) =>
    lines.slice(0, lineCount);
  const { content, err } = trimFileContent(
    state.getFileSystem(),
    filePath,
    options,
    headTrimmingFn
  );

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    output: OutputFactory.makeTextOutput(content as string)
  };
};
