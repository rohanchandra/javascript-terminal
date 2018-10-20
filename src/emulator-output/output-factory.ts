import { Record } from 'immutable';
import {
  HEADER_OUTPUT_TYPE,
  TEXT_ERROR_OUTPUT_TYPE,
  TEXT_OUTPUT_TYPE
} from './output-type';

import { IEmulatorError } from '../types';

/**
 * Output from a command or emulator used for display to the user
 * @type {OutputRecord}
 */
export const OutputRecord = new (Record as any)({
  content: undefined,
  date: undefined,
  type: undefined
});

/**
 * A terminal header containing metadata
 * @param  {string} cwd   the current working directory path
 * @param  {string} command   the current working directory path
 */
export const makeHeaderOutput = (cwd: string, command?: string) => {
  return new OutputRecord({
    content: { cwd, command },
    date: Date.now(),
    type: HEADER_OUTPUT_TYPE
  });
};

/**
 * Unstyled text output
 * @param  content plain string output from a command or the emulator
 * @return output record
 */
export const makeTextOutput = (content: any ) => {
  return new OutputRecord({
    content,
    date: Date.now(),
    type: TEXT_OUTPUT_TYPE
  });
};

/**
 * Error text output
 * @param  {object} err internal error object
 * @return {OutputRecord}   output record
 */
export const makeErrorOutput = (err: IEmulatorError) => {
  return new OutputRecord({
    content: `${err.source}: ${err.type}`,
    date: Date.now(),
    type: TEXT_ERROR_OUTPUT_TYPE
  });
};
