import * as repl from 'repl';
import { getTerminalEvaluator } from './cli-evaluator';

const replEvaluator = getTerminalEvaluator();

repl.start({
  eval: (cmd: any, context: any, filename: any, callback: any) => {
    const outputStr = replEvaluator(cmd);

    console.log(outputStr);

    callback();
  },
  prompt: 'emulator$ '
});
