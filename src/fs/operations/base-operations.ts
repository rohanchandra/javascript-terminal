import { IEmulatorError, IFileSystem } from '../../types';
import { fsErrorType, makeError } from '../fs-error';
import * as DirOp from '../operations/directory-operations';
import * as FileOp from '../operations/file-operations';
import * as GlobUtil from '../util/glob-util';
import * as PathUtil from '../util/path-util';

/**
 * Adds a file or directory to a path
 * @param {Map}     fs                     file system
 * @param {string}  pathToAdd              path to add the file or directory to
 * @param {string}  fsElementToAdd         file or directory map
 * @param {Boolean} [addParentPaths=false] true, if path parent directories should
 *                                         be made (if they don't exist)
 * @return {object}                        file system or error
 */
export const add = (
  fs: IFileSystem,
  pathToAdd: string,
  fsElementToAdd: string | IFileSystem,
  addParentPaths = false
): { fs: IFileSystem | undefined; err: IEmulatorError | undefined } => {
  if (fs.has(pathToAdd)) {
    return {
      err: makeError(fsErrorType.FILE_OR_DIRECTORY_EXISTS),
      fs: undefined
    };
  }

  const parentPaths = PathUtil.getPathBreadCrumbs(pathToAdd).slice(0, -1);

  for (const parentPath of parentPaths) {
    if (FileOp.hasFile(fs, parentPath)) {
      return {
        err: makeError(
          fsErrorType.NOT_A_DIRECTORY,
          `Cannot add path to a file: ${parentPath}`
        ),
        fs: undefined
      };
    }

    if (!fs.has(parentPath) && !addParentPaths) {
      return {
        err: makeError(
          fsErrorType.NO_SUCH_DIRECTORY,
          `Parent directory does not exist: ${parentPath}`
        ),
        fs: undefined
      };
    }
  }

  const addedDirectoryFs = fs.set(pathToAdd, fsElementToAdd);

  return {
    err: undefined,
    fs: addParentPaths ? DirOp.fillGaps(addedDirectoryFs) : addedDirectoryFs,

  };
};

/**
 * Removes a file or directory from a path
 * @param  {Map}     fs                                  file system
 * @param  {string}  pathToRemove                        removes the path
 * @param  {Boolean} [isNonEmptyDirectoryRemovable=true] true if non-empty paths can be removed
 * @return {object}                                      file system or error
 */
export const remove = (
  fs: IFileSystem,
  pathToRemove: string,
  isNonEmptyDirectoryRemovable = true
) => {
  if (!fs.has(pathToRemove)) {
    return {
      err: makeError(fsErrorType.NO_SUCH_FILE_OR_DIRECTORY)
    };
  }

  const childPathPattern = pathToRemove === '/' ? '/**' : `${pathToRemove}/**`;
  const childPaths = GlobUtil.globPaths(fs, childPathPattern);

  if (!isNonEmptyDirectoryRemovable && !childPaths.isEmpty()) {
    return {
      err: makeError(fsErrorType.DIRECTORY_NOT_EMPTY)
    };
  }

  return {
    fs: fs.removeAll(childPaths.concat(pathToRemove))
  };
};
