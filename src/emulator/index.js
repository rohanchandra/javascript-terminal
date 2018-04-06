import * as CommandRunner from 'emulator/command-runner';
import parseCommands from 'parser/command-parser';
import { makeHeaderOutput, makeTextOutput } from 'emulator-output/output-factory';
import { recordCommand } from 'emulator-state/history';
import { getEnvironmentVariable } from 'emulator-state/environment-variables';
import { suggestCommands, suggestCommandOptions, suggestFileSystemNames } from 'emulator/auto-complete';
import { List } from 'immutable';

export default class Emulator {
  /**
   * Completes user input if there is one, and only one, suggestion.
   *
   * If there are no suggestions or more than one suggestion, the original
   * user input will be returned.
   * @param  {EmulatorState} state      emulator state
   * @param  {string}        partialStr partial user input to the emulator
   * @return {string}                   completed user input when one suggest (or, otherwsie, the original input)
   */
  autocomplete(state, partialStr) {
    const suggestions = this.suggest(state, partialStr);

    if (suggestions.length !== 1) {
      return partialStr;
    }

    const strParts = new List(partialStr.split(' '));
    const autocompletedText = suggestions[0];

    return strParts
      .update(-1, lastVal => autocompletedText)
      .join(' ');
  };

  /**
   * Suggest what the user will type next
   * @param  {EmulatorState} state      emulator state
   * @param  {string}        partialStr partial user input of a command
   * @return {array}                    list of possible text suggestions
   */
  suggest(state, partialStr) {
    partialStr = this._trimLeadingSpace(partialStr);

    const lastPartialChar = partialStr.slice(-1);
    const isTypingNewPart = lastPartialChar === ' ';

    const strParts = partialStr.trim().split(' ');
    const {start: cmdName, end: lastTextEntered} = this._getBoundaryWords(strParts);

    if (!isTypingNewPart && strParts.length === 1) {
      return suggestCommands(state.getCommandMapping(), cmdName);
    }

    const strToComplete = isTypingNewPart ? '' : lastTextEntered;
    const cwd = getEnvironmentVariable(state.getEnvVariables(), 'cwd');

    return [
      ...suggestCommandOptions(state.getCommandMapping(), cmdName, strToComplete),
      ...suggestFileSystemNames(state.getFileSystem(), cwd, strToComplete)
    ];
  };

  _trimLeadingSpace(str) {
    return str.replace(/^\s+/g, '');
  };

  _getBoundaryWords(strParts) {
    return {
      start: strParts[0],
      end: strParts[strParts.length - 1]
    };
  };

  /**
   * Runs emulator command
   * @param  {EmulatorState}  state                   emulator state before running command
   * @param  {string}         str                     command string to execute
   * @param  {Array}          [executionListeners=[]] list of plugins to notify while running the command
   * @return {EmulatorState}                          updated emulator state after running command
   */
  execute(state, str, executionListeners = []) {
    for (const executionListener of executionListeners) {
      executionListener.onExecuteStarted(state, str);
    };

    state = this._addHeaderOutput(state, str);

    if (str.trim() === '') {
      // empty command string
      state = this._addCommandOutputs(state, [makeTextOutput('')]);
    } else {
      state = this._addCommandToHistory(state, str);
      state = this._updateStateByExecution(state, str);
    }

    for (const executionListener of executionListeners) {
      executionListener.onExecuteCompleted(state);
    };

    return state;
  };

  _updateStateByExecution(state, commandStrToExecute) {
    for (const {commandName, commandOptions} of parseCommands(commandStrToExecute)) {
      const commandMapping = state.getCommandMapping();
      const commandArgs = [state, commandOptions];

      const {state: nextState, output, outputs} = CommandRunner.run(
        commandMapping, commandName, commandArgs
      );

      if (nextState) {
        state = nextState;
      }

      if (output) {
        state = this._addCommandOutputs(state, [output]);
      } else if (outputs) {
        state = this._addCommandOutputs(state, outputs);
      }
    }

    return state;
  }

  _addCommandToHistory(state, command) {
    const history = state.getHistory();

    return state.setHistory(recordCommand(history, command));
  }

  _addHeaderOutput(state, commandStr) {
    const envVariables = state.getEnvVariables();
    const cwd = getEnvironmentVariable(envVariables, 'cwd');

    return this._addCommandOutputs(state, [makeHeaderOutput(cwd, commandStr)]);
  }

  /**
   * Appends outputs to the internal state of outputs
   * @param {List} outputs list of outputs
   */
  _addCommandOutputs(state, outputs) {
    for (const output of outputs) {
      const outputs = state.getOutputs();

      state = state.setOutputs(outputs.push(output));
    }

    return state;
  }
}
