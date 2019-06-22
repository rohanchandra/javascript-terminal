/**
 * Copies a file/directory to another file/directory
 * Usage: cp file new-file
 */
import parseOptions from 'parser/option-parser';
import * as FileOp from 'fs/operations-with-permissions/file-operations';
import * as DirectoryOp from 'fs/operations-with-permissions/directory-operations';
import * as PathUtil from 'fs/util/path-util';
import * as OutputFactory from 'emulator-output/output-factory';
import * as FileUtil from 'fs/util/file-util';
import { makeError, fsErrorType } from 'fs/fs-error';
import { resolvePath } from 'emulator-state/util';

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
const copySourceFile = (state, srcPath, destPath, isTrailingPathDest) => {
  const fs = state.getFileSystem();

  if (isTrailingPathDest && !DirectoryOp.hasDirectory(fs, destPath)) {
    const dirAtTrailingPathNonExistentErr = makeError(fsErrorType.NO_SUCH_DIRECTORY);

    return {
      output: OutputFactory.makeErrorOutput(dirAtTrailingPathNonExistentErr)
    };
  }

  const {fs: copiedFS, err} = FileOp.copyFile(fs, srcPath, destPath);

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(copiedFS)
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
const copySourceDirectory = (state, srcPath, destPath) => {
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
    const {fs, err} = DirectoryOp.addDirectory(state.getFileSystem(), destPath, emptyDir, false);

    state = state.setFileSystem(fs);

    if (err) {
      return {
        output: OutputFactory.makeErrorOutput(err)
      };
    }
  }

  const {fs, err} = DirectoryOp.copyDirectory(state.getFileSystem(), srcPath, destPath);

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  return {
    state: state.setFileSystem(fs)
  };
};

export const optDef = {
  '-r, --recursive': '' // required to copy directories
};

export default (state, commandOptions) => {
  const {argv, options} = parseOptions(commandOptions, optDef);

  if (argv.length < 2) {
    return {};
  }

  const srcPath = resolvePath(state, argv[0]);
  const destPath = resolvePath(state, argv[1]);
  const isTrailingDestPath = PathUtil.isTrailingPath(argv[1]);

  if (srcPath === destPath) {
    return {
      output: OutputFactory.makeTextOutput('Source and destination are the same (not copied).')
    };
  }

  if (options.recursive) {
    return copySourceDirectory(state, srcPath, destPath);
  }

  return copySourceFile(state, srcPath, destPath, isTrailingDestPath);
};
