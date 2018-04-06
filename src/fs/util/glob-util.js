import minimatch from 'minimatch';
import capture from 'minimatch-capture';
import { List } from 'immutable';

const GLOB_OPTIONS = {dot: true};

export const glob = (str, globPattern) => {
  return minimatch(str, globPattern, GLOB_OPTIONS);
};

export const globSeq = (seq, globPattern) => {
  return seq.filter((path) => minimatch(path, globPattern, GLOB_OPTIONS));
};

export const globPaths = (fs, globPattern) => {
  return globSeq(fs.keySeq(), globPattern);
};

export const captureGlobPaths = (fs, globPattern, filterCondition = (path) => true) => {
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
