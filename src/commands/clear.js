/**
 * Removes all terminal output
 * Usage: clear
 */
import { create as createOutputs } from 'emulator-state/outputs';

export const optDef = {};

export default (state, commandOptions) => {
  return {
    state: state.setOutputs(createOutputs())
  };
};
