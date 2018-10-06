/**
 * Removes all terminal output
 * Usage: clear
 */
import EmulatorState from '../emulator-state/EmulatorState';
import { create as createOutputs } from '../emulator-state/outputs';

export const optDef = {};

export const help = 'Clears the screen of all outputs.';

export default (state: EmulatorState, commandOptions: string[]) => {
  return {
    state: state.setOutputs(createOutputs())
  };
};
