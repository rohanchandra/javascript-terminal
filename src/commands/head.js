/**
 * Prints the first n lines of a file
 * Usage: head -n 5 file.txt
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
  const headTrimmingFn = (lines, lineCount) => lines.slice(0, lineCount);
  const {content, err} = trimFileContent(
    state.getFileSystem(), filePath, options, headTrimmingFn
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
