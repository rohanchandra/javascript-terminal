import { Map, Stack } from 'immutable';
import { OutputRecord } from './emulator-output/output-factory';
import { emulatorErrorType } from './emulator/emulator-error';
import { fsErrorType } from './fs/fs-error';

// Commands
export type CommandName = string;
export interface ICommandObject {
  function: () => any;
  help: string;
  optDef: any;
}
export interface ICommandObjectMapping {
  [commandName: string]: ICommandObject;
}
export interface ICommandMapping
  extends Map<CommandName, Map<'help' | 'function' | 'optDef', any>> {}

export interface IOptDef {
  argv: any;
  options: any;
}

export interface IEnvVars extends Map<string, string> {}

export interface IFileSystem extends Map<string, any> {}

export type OutputRecordType = typeof OutputRecord;

export type EmulatorErrorType = fsErrorType | emulatorErrorType;

export interface IEmulatorError {
  message: string;
  source: 'emulator' | 'fs';
  type: EmulatorErrorType;
}

export interface IHistoryStack extends Stack<string> {}
