/**
 * Lists or clears commands executed in the terminal
 * Usage: history -c
 */
import parseOptions from 'parser/option-parser';
import * as OutputFactory from 'emulator-output/output-factory';
import { create as createHistory } from 'emulator-state/history';

const clearStateHistory = (state) =>
  state.setHistory(createHistory());

const stringifyStateHistory = (state) =>
  state.getHistory().join('\n');

export const optDef = {
  '-c, --clear': '' // remove history entries
};

export default (state, commandOptions) => {
  const {options} = parseOptions(commandOptions, optDef);

  if (options.clear) {
    return {
      state: clearStateHistory(state)
    };
  };

  return {
    output: OutputFactory.makeTextOutput(stringifyStateHistory(state))
  };
};
