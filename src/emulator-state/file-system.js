import * as FileUtil from 'fs/util/file-util';
import * as DirOp from 'fs/operations/directory-operations';
import { fromJS } from 'immutable';

const DEFAULT_FILE_SYSTEM = {
  '/': FileUtil.makeDirectory()
};

/**
 * Creates an immutable data structure for a file system
 * @param  {object} jsFs a file system in a simple JavaScript object
 * @return {Map}         an immutable file system
 */
export const create = (jsFs = DEFAULT_FILE_SYSTEM) => {
  return DirOp.fillGaps(fromJS(jsFs));
};
