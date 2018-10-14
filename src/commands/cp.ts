/**
 * Copies a file/directory to another file/directory
 * Usage: cp file new-file
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { resolvePath } from '../emulator-state/util';
import { fsErrorType, makeError } from '../fs/fs-error';
import * as DirectoryOp from '../fs/operations-with-permissions/directory-operations';
import * as FileOp from '../fs/operations-with-permissions/file-operations';
import * as FileUtil from '../fs/util/file-util';
import * as PathUtil from '../fs/util/path-util';
import parseOptions from '../parser/option-parser';
import { IFileSystem } from '../types';

/**
 * Copy from a source file into a directory or another file.
 *
 * A trailing slash / can be used in the destination to explicitly state the
 * destination is a directory and not a file.
 * @param  {Map}     state              emulator state
 * @param  {string}  srcPath            source file path
 * @param  {string}  destPath           destination file or destination directory path
 * @param  {Boolean} isTrailingPathDest true if the destPath ended in a /
 * @return {object}                     cp command return object
 */
const copySourceFile = (
  state: EmulatorState,
  srcPath: string,
  destPath: string,
  isTrailingPathDest: boolean
): { output?: any; state?: EmulatorState } => {
  const fs = state.getFileSystem();

  if (isTrailingPathDest && !DirectoryOp.hasDirectory(fs, destPath)) {
    const dirAtTrailingPathNonExistentErr = makeError(
      fsErrorType.NO_SUCH_DIRECTORY
    );

    return {
      output: OutputFactory.makeErrorOutput(dirAtTrailingPathNonExistentErr)
    };
  }

  const { fs: copiedFS, err } = FileOp.copyFile(fs, srcPath, destPath);

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(copiedFS as IFileSystem)
  };
};

/**
 * Copies a directory into another directory
 *
 * When the destination path exists, cp copies the source FOLDER into the
 * destination.
 *
 * When the destination DOES NOT exist, cp copies the source FILES into the
 * destination.
 * @param  {Map}    state      emulator state
 * @param  {string} srcPath    source directory path (copy from)
 * @param  {string} destPath   destination directory path (copy to)
 * @return {object}            cp command return object
 */
const copySourceDirectory = (
  state: EmulatorState,
  srcPath: string,
  destPath: string
) => {
  if (DirectoryOp.hasDirectory(state.getFileSystem(), destPath)) {
    const lastPathComponent = PathUtil.getLastPathPart(srcPath);

    // Remap dest to copy source FOLDER, as destination path exists
    if (lastPathComponent !== '/') {
      destPath = `${destPath}/${lastPathComponent}`;
    }
  }

  // Make directory to copy into, if it doesn't already exist
  if (!DirectoryOp.hasDirectory(state.getFileSystem(), destPath)) {
    const emptyDir = FileUtil.makeDirectory();
    const { fs: _fs, err: _err } = DirectoryOp.addDirectory(
      state.getFileSystem(),
      destPath,
      emptyDir
    );

    state = state.setFileSystem(_fs as IFileSystem);

    if (_err) {
      return {
        output: OutputFactory.makeErrorOutput(_err)
      };
    }
  }

  const { fs, err } = DirectoryOp.copyDirectory(
    state.getFileSystem(),
    srcPath,
    destPath
  );

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(fs as IFileSystem)
  };
};

export const optDef = {
  '-r, --recursive': '' // required to copy directories
};

export default (state: EmulatorState, commandOptions: string[]) => {
  const { argv, options } = parseOptions(commandOptions, optDef);

  if (argv.length < 2) {
    return {};
  }

  const srcPath = resolvePath(state, argv[0]);
  const destPath = resolvePath(state, argv[1]);
  const isTrailingDestPath = PathUtil.isTrailingPath(argv[1]);

  if (srcPath === destPath) {
    return {
      output: OutputFactory.makeTextOutput(
        'Source and destination are the same (not copied).'
      )
    };
  }

  if (options.recursive) {
    return copySourceDirectory(state, srcPath, destPath);
  }

  return copySourceFile(state, srcPath, destPath, isTrailingDestPath);
};
