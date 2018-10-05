/**
 * Removes all terminal output
 * Usage: clear
 */
import { create as createOutputs } from 'emulator-state/outputs';

export const optDef = {};

export const help = 'Clears the screen of all outputs.';

export default (state, commandOptions) => {
  return {
    state: state.setOutputs(createOutputs())
  };
};
