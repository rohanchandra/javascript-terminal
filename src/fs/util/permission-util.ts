import { IFileSystem } from '../../types';
import * as PathUtil from '../util/path-util';

const DEFAULT_PERMISSION = true;

/**
 * Checks if a single path can be modified by checking the 'canModify' key held
 * in the path.
 *
 * This does NOT check parents of the path.
 * @param  {Map}     fs   file system
 * @param  {string}  path path to check for modification permission
 * @return {Boolean}      true, if a single path can be modified
 */
const isModificationAllowed = (fs: IFileSystem, path: string) => {
  const directory = fs.get(path, null);

  if (directory) {
    const canModify = directory.get('canModify', DEFAULT_PERMISSION);

    if (!canModify) {
      return false;
    }
  }

  return true;
};

/**
 * Checks if a path and its parents can be modified.
 * @param  {Map}     fs   file systems
 * @param  {String}  path path to a directory or file
 * @return {Boolean}      true, if the path and its parents can be modified
 */
export const canModifyPath = (fs: IFileSystem, path: string) => {
  const breadCrumbPaths = PathUtil.getPathBreadCrumbs(path);

  for (const breadCrumbPath of breadCrumbPaths) {
    if (!isModificationAllowed(fs, breadCrumbPath)) {
      return false;
    }
  }

  return true;
};
