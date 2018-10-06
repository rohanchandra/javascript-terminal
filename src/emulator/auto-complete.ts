import {
  getCommandNames,
  getCommandOptDef,
  isCommandSet
} from '../emulator-state/command-mapping';
import * as GlobUtil from '../fs/util/glob-util';
import * as PathUtil from '../fs/util/path-util';
import { ICommandMapping, IFileSystem } from '../types';

/**
 * Suggest command names
 * @param  {Map}    cmdMapping     command mapping
 * @param  {string} partialStr     partial user input of a command
 * @return {array}                 list of possible text suggestions
 */
export const suggestCommands = (
  cmdMapping: ICommandMapping,
  partialStr: string
) => {
  const commandNameSeq = getCommandNames(cmdMapping);

  return [...GlobUtil.globSeq(commandNameSeq, `${partialStr}*`)];
};

/**
 * Suggest command options
 * @param  {Map}    cmdMapping     command mapping
 * @param  {string} commandName    name of the command user is running
 * @param  {string} partialStr     partial user input of a command (excluding the command name)
 * @return {array}                 list of possible text suggestions
 */
export const suggestCommandOptions = (
  cmdMapping: ICommandMapping,
  commandName: string,
  partialStr: string
) => {
  if (!isCommandSet(cmdMapping, commandName)) {
    return [];
  }

  const optDef = getCommandOptDef(cmdMapping, commandName);
  if (!optDef) {
    return [];
  }
  const optDefSeq = optDef
    .keySeq()
    .flatMap(opts => opts.split(',').map(opt => opt.trim()));

  return [...GlobUtil.globSeq(optDefSeq, `${partialStr}*`)];
};

/**
 * Suggest file and folder names from partially completed user input
 * @param  {Map}    fileSystem file system
 * @param  {string} cwd        current working directory
 * @param  {string} partialStr partial string to base suggestions on (excluding the command name)
 * @return {array}             list of possible text suggestions
 */
export const suggestFileSystemNames = (
  fileSystem: IFileSystem,
  cwd: string,
  partialStr: string
) => {
  const path = PathUtil.toAbsolutePath(partialStr, cwd);

  // complete name of a folder or file
  const completeNamePattern = `${path}*`;
  // complete child folder name
  const completeSubfolderPattern = path === '/' ? '/*' : `${path}*/*`;
  // only complete child folders when the path ends with / (which marks a directory path)
  const globPattern = partialStr.endsWith('/')
    ? completeSubfolderPattern
    : completeNamePattern;

  const childPaths = GlobUtil.globPaths(fileSystem, globPattern);

  if (PathUtil.isAbsPath(partialStr)) {
    return [...childPaths]; // absolute paths
  }

  return [
    ...childPaths.map(_path => {
      const pathPartsWithoutTail = PathUtil.toPathParts(partialStr).slice(
        0,
        -1
      );
      const newTail = PathUtil.getLastPathPart(_path);

      return PathUtil.toPath(pathPartsWithoutTail.concat(newTail));
    })
  ]; // relative paths
};
