/**
 * Tests if a path is a trailing path.
 *
 * A trailing path ends with a trailing slash (/) and excludes the root
 * directory (/).
 * @param  {string}  path path with or without a trailing slash
 * @return {Boolean}      true, if the path is a trailing path
 */
export const isTrailingPath = (path: string) => {
  return path.endsWith('/') && path !== '/';
};

/**
 * Removes a trailing slash (/) from a path
 * @param  {string} path path with or without a trailing /
 * @return {string}      path without trailing /
 */
export const removeTrailingSeparator = (path:string) => {
  if (path.endsWith('/') && path !== '/') {
    return path.slice(0, -1);
  }
  return path;
};

/**
 * Tests if a path is absolute
 * @param  {string}  path
 * @return {boolean}
 */
export const isAbsPath = (path:string) => {
  return path.startsWith('/');
};

/**
 * Converts a path to an ordered array of folders and files.
 *
 * Example: Parts of '/a/b/c/e.txt' has parts of ['/', 'a', 'b', 'c', 'e.txt']
 *
 * A relative path splits parts at /. An absolute path splits at / and also
 * considers the root directory (/) as a part of the path.
 * @param  {string} path [description]
 * @return {array}       list of path parts
 */
export const toPathParts = (path:string): string[] => {
  if (path === '/') {
    return ['/'];
  };

  path = removeTrailingSeparator(path);
  const pathParts = path.split('/');

  if (isAbsPath(path)) {
    const [, ...nonRootPathParts] = pathParts;

    return ['/', ...nonRootPathParts];
  }

  return pathParts;
};

/**
 * Converts path parts back to a path
 * @param  {array} pathParts path parts
 * @return {string}          path
 */
export const toPath = (pathParts: string[]) => {
  if (pathParts[0] === '/') { // absolute path
    const [, ...nonRootPathParts] = pathParts;

    return `/${nonRootPathParts.join('/')}`;
  }

  return pathParts.join('/');
};

/**
 * Find breadcrumb paths, i.e. all paths that need to be walked to get to
 * the specified path
 * Example: /a/b/c will have breadcrumb paths of '/', '/a', '/a/b', '/a/b/c'
 * @param  {string} path path to a directory
 * @return {array}       list of paths that lead up to a path
 */
export const getPathBreadCrumbs = (path: string): string[] => {
  const pathParts = toPathParts(path);

  if (pathParts.length <= 1) {
    return ['/'];
  }

  const [, secondPathPart, ...pathPartsWithoutRoot] = pathParts;

  return pathPartsWithoutRoot.reduce((breadCrumbs, pathPart) => {
    const previousBreadCrumb = breadCrumbs[breadCrumbs.length - 1];

    return [...breadCrumbs, `${previousBreadCrumb}/${pathPart}`];
  }, ['/', `/${secondPathPart}`]);
};

/**
 * Removes the file name from the end of a file path, returning the path to the
 * directory of the file
 * @param  {string} filePath path which ends with a file name
 * @return {string}          directory path
 */
export const getPathParent = (filePath: string) => {
  if (filePath === '/') {
    return '/';
  }

  const pathParts = toPathParts(filePath); // converts path string to array
  const pathPartsWithoutFileName = pathParts.slice(0, -1); // removes last element of array

  return toPath(pathPartsWithoutFileName);
};

/**
 * Extracts the file name from the end of the file path
 * @param  {string} filePath path which ends with a file name
 * @return {string}          file name from the path
 */
export const getLastPathPart = (filePath: string) => {
  const pathParts = toPathParts(filePath); // converts path string to array

  return pathParts[pathParts.length - 1];
};

/**
 * Extracts the file name and directory path from a file path
 * @param  {string} filePath path which ends with a file name
 * @return {object}          object with directory and file name
 */
export const splitFilePath = (filePath: string) => {
  return {
    'dirPath': getPathParent(filePath),
    'fileName': getLastPathPart(filePath)
  };
};

const GO_UP = '..';
const CURRENT_DIR = '.';
const isStackAtRootDirectory = (stack: string[]) => stack.length === 1 && stack[0] === '/';
/**
 * Converts a relative path to an absolute path
 * @param  {string} relativePath
 * @param  {string} cwd          current working directory
 * @return {string}              absolute path
 */
export const toAbsolutePath = (relativePath: string, cwd: string) => {
  relativePath = removeTrailingSeparator(relativePath);
  const pathStack = isAbsPath(relativePath) ? [] : toPathParts(cwd);

  for (const pathPart of toPathParts(relativePath)) {
    if (pathPart === GO_UP) {
      if (!isStackAtRootDirectory(pathStack)) {
        pathStack.pop();
      }
    } else if (pathPart !== CURRENT_DIR) {
      pathStack.push(pathPart);
    }
  }

  return toPath(pathStack);
};
