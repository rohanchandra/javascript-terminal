/**
 * Lists or clears commands executed in the terminal
 * Usage: history -c
 */
import * as OutputFactory from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { create as createHistory } from '../emulator-state/history';
import parseOptions from '../parser/option-parser';

const clearStateHistory = (state: EmulatorState) =>
  state.setHistory(createHistory());

const stringifyStateHistory = (state: EmulatorState) =>
  state.getHistory().join('\n');

export const optDef = {
  '-c, --clear': '' // remove history entries
};
export const help = 'Print history of commands';

export default (state: EmulatorState, commandOptions: string[]) => {
  const { options } = parseOptions(commandOptions, optDef);

  if (options.clear) {
    return {
      state: clearStateHistory(state)
    };
  }

  return {
    output: OutputFactory.makeTextOutput(stringifyStateHistory(state))
  };
};
