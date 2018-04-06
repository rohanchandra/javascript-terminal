/**
 * Prints the last n lines of a file
 * Usage: tail -n 5 file.txt
 */
import parseOptions from 'parser/option-parser';
import * as OutputFactory from 'emulator-output/output-factory';
import { trimFileContent } from 'commands/util/_head_tail_util.js';
import { resolvePath } from 'emulator-state/util';

export const optDef = {
  '-n, --lines': '<count>'
};

export default (state, commandOptions) => {
  const {argv, options} = parseOptions(commandOptions, optDef);

  if (argv.length === 0) {
    return {};
  }

  const filePath = resolvePath(state, argv[0]);
  const tailTrimmingFn = (lines, lineCount) => lines.slice(-1 * lineCount);
  const {content, err} = trimFileContent(
    state.getFileSystem(), filePath, options, tailTrimmingFn
  );

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    output: OutputFactory.makeTextOutput(content)
  };
};
