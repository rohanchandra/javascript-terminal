const repl = require('repl');
const getTerminalEvaluator = require('./cli-evaluator');

const replEvaluator = getTerminalEvaluator();

return repl.start({
  prompt: 'emulator$ ',
  eval: (cmd, context, filename, callback) => {
    const outputStr = replEvaluator(cmd);

    console.log(outputStr);

    callback();
  }
});
