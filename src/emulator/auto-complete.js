import * as PathUtil from 'fs/util/path-util';
import * as GlobUtil from 'fs/util/glob-util';
import { isCommandSet, getCommandNames, getCommandOptDef } from 'emulator-state/command-mapping';

/**
 * Suggest command names
 * @param  {Map}    cmdMapping     command mapping
 * @param  {string} partialStr     partial user input of a command
 * @return {array}                 list of possible text suggestions
 */
export const suggestCommands = (cmdMapping, partialStr) => {
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
export const suggestCommandOptions = (cmdMapping, commandName, partialStr) => {
  if (!isCommandSet(cmdMapping, commandName)) {
    return [];
  }

  const optDefSeq = getCommandOptDef(cmdMapping, commandName)
    .keySeq()
    .flatMap(opts =>
      opts.split(',').map(opt => opt.trim())
    );

  return [...GlobUtil.globSeq(optDefSeq, `${partialStr}*`)];
};

/**
 * Suggest file and folder names from partially completed user input
 * @param  {Map}    fileSystem file system
 * @param  {string} cwd        current working directory
 * @param  {string} partialStr partial string to base suggestions on (excluding the command name)
 * @return {array}             list of possible text suggestions
 */
export const suggestFileSystemNames = (fileSystem, cwd, partialStr) => {
  const path = PathUtil.toAbsolutePath(partialStr, cwd);

  // complete name of a folder or file
  const completeNamePattern = `${path}*`;
  // complete child folder name
  const completeSubfolderPattern = path === '/' ? '/*' : `${path}*/*`;
  // only complete child folders when the path ends with / (which marks a directory path)
  const globPattern = partialStr.endsWith('/') ? completeSubfolderPattern : completeNamePattern;

  const childPaths = GlobUtil.globPaths(fileSystem, globPattern);

  if (PathUtil.isAbsPath(partialStr)) {
    return [...childPaths]; // absolute paths
  }

  return [...childPaths.map(path => {
    const pathPartsWithoutTail = PathUtil.toPathParts(partialStr).slice(0, -1);
    const newTail = PathUtil.getLastPathPart(path);

    return PathUtil.toPath(pathPartsWithoutTail.concat(newTail));
  })]; // relative paths
};
