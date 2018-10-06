/**
 * Lists the contents of a directory
 * Usage: ls /folderName
 */
import { Seq } from 'immutable';
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import * as EnvVariableUtil from '../emulator-state/environment-variables';
import * as DirectoryOp from '../fs/operations-with-permissions/directory-operations';
import * as PathUtil from '../fs/util/path-util';
import parseOptions from '../parser/option-parser';
import {IEnvVars} from "../types";

const IMPLIED_DIRECTORY_ENTRIES = Seq(['.', '..']); // . = listed folder, .. = parent folder

/**
 * Finds the directory path to list entries in.
 *
 * If ls has an argument passed in (example: ls /home/user/directory-to-list),
 * use the first argument as the directory to list.
 *
 * If ls is used without any path arguments (example: ls), the cwd (current
 * working directory) should be listed by ls.
 * @param  {Map}    envVariables  environment variables
 * @param  {array}  argv          argument vector
 * @return {string}               directory path to list
 */
const resolveDirectoryToList = (envVariables: IEnvVars, argv: string[]) => {
  const cwd = EnvVariableUtil.getEnvironmentVariable(envVariables, 'cwd') as string;

  if (argv.length > 0) {
    return PathUtil.toAbsolutePath(argv[0], cwd);
  }

  return cwd;
};

/**
 * Alphabetically sorts the ls listing for display to the user
 * @param  {array}  listing list of files/directories to present to the user
 * @return {object}         return object of ls
 */
const makeSortedReturn = (listing: Seq.Indexed<any>) => {
  const sortedListing = listing.sort();

  return {
    output: OutputFactory.makeTextOutput(sortedListing.join('\n'))
  };
};

const removeHiddenFilesFilter = (record: string) => {
  return !record.startsWith('.');
};

export const optDef = {
  '-A, --almost-all': '', // Do not include . and .. as implied directory entries,
  '-a, --all': '' // Include hidden directory entries starting with .
};

export default (state: EmulatorState, commandOptions: string[]) => {
  const { options, argv } = parseOptions(commandOptions, optDef);
  const dirPath = resolveDirectoryToList(state.getEnvVariables(), argv);
  const { err, list: dirList } = DirectoryOp.listDirectory(
    state.getFileSystem(),
    dirPath
  );

  if (err) {
    return {
      output: OutputFactory.makeErrorOutput(err)
    };
  }

  if (options.all) {
    return makeSortedReturn(IMPLIED_DIRECTORY_ENTRIES.concat(dirList));
  } else if (options.almostAll) {
    return makeSortedReturn(dirList);
  }

  return makeSortedReturn(dirList.filter(removeHiddenFilesFilter));
};
