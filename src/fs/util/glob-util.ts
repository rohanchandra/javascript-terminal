import { List, Seq } from 'immutable';
import minimatch from 'minimatch';
import capture from 'minimatch-capture';

import { IFileSystem } from '../../types';

const GLOB_OPTIONS = { dot: true };

export const glob = (str: string, globPattern: string) => {
  return minimatch(str, globPattern, GLOB_OPTIONS);
};

export const globSeq = (seq: Seq.Indexed<string>, globPattern: string) => {
  return seq.filter((path: string) =>
    minimatch(path, globPattern, GLOB_OPTIONS)
  );
};

export const globPaths = (fs: IFileSystem, globPattern: string) => {
  return globSeq(fs.keySeq(), globPattern);
};

export const captureGlobPaths = (
  fs: IFileSystem,
  globPattern: string,
  filterCondition = (path: string) => true
) => {
  return fs.keySeq().reduce((captures, path) => {
    if (filterCondition(path)) {
      const pathCaptures = capture(path, globPattern, GLOB_OPTIONS);

      if (pathCaptures) {
        return captures.concat(pathCaptures);
      }
    }

    return captures;
  }, List());
};
