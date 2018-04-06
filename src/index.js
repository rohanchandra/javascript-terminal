import Emulator from 'emulator';
import HistoryKeyboardPlugin from 'emulator/plugins/HistoryKeyboardPlugin';
import { EmulatorState, CommandMapping, EnvironmentVariables, FileSystem, History, Outputs } from 'emulator-state';
import { OutputFactory, OutputType } from 'emulator-output';
import { DirOp, FileOp } from 'fs';
import { OptionParser } from 'parser';
import defaultCommandMapping from 'commands';

// Any class/function exported here forms part of the emulator API
export {
  Emulator, HistoryKeyboardPlugin,
  defaultCommandMapping,
  EmulatorState, CommandMapping, EnvironmentVariables, FileSystem, History, Outputs, // state API
  OutputFactory, OutputType, // output API
  DirOp, FileOp, // file system API
  OptionParser // parser API
};
