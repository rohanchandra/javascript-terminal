import * as FileOp from 'fs/operations-with-permissions/file-operations';
import * as OutputFactory from 'emulator-output/output-factory';

const DEFAULT_LINE_COUNT = 10;

export const trimFileContent = (fs, filePath, options, trimmingFn) => {
  const {file, err} = FileOp.readFile(fs, filePath);

  if (err) {
    return {
      err: OutputFactory.makeErrorOutput(err)
    };
  };

  const linesCount = options.lines ? Number(options.lines) : DEFAULT_LINE_COUNT;
  const trimmedLines = trimmingFn(file.get('content').split('\n'), linesCount);

  return {
    content: trimmedLines.join('\n')
  };
};
