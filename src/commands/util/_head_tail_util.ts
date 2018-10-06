import * as FileOp from '../../fs/operations-with-permissions/file-operations';
import { IEmulatorError, IFileSystem } from '../../types';

const DEFAULT_LINE_COUNT = 10;

export const trimFileContent = (
  fs: IFileSystem,
  filePath: string,
  options: any,
  trimmingFn: (lines: string[], linesCount: number) => string[]
): { content: any; err: IEmulatorError | undefined } => {
  const { file, err } = FileOp.readFile(fs, filePath);

  if (err) {
    return {
      content: undefined,
      err
    };
  }

  const linesCount = options.lines ? Number(options.lines) : DEFAULT_LINE_COUNT;
  const trimmedLines = trimmingFn(file.get('content').split('\n'), linesCount);

  return {
    content: trimmedLines.join('\n'),
    err: undefined
  };
};
