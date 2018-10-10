import { List } from 'immutable';

import {
  makeHeaderOutput,
  makeTextOutput
} from '../emulator-output/output-factory';
import EmulatorState from '../emulator-state/EmulatorState';
import { getEnvironmentVariable } from '../emulator-state/environment-variables';
import { recordCommand } from '../emulator-state/history';
import parseCommands from '../parser/command-parser';
import {
  suggestCommandOptions,
  suggestCommands,
  suggestFileSystemNames
} from './auto-complete';
import * as CommandRunner from './command-runner';

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
  autocomplete(state: EmulatorState, partialStr: string) {
    const suggestions = this.suggest(state, partialStr);

    if (suggestions.length !== 1) {
      return partialStr;
    }

    const strParts = List(partialStr.split(' '));
    const autocompletedText = suggestions[0];

    return strParts.update(-1, lastVal => autocompletedText).join(' ');
  }

  /**
   * Suggest what the user will type next
   * @param  {EmulatorState} state      emulator state
   * @param  {string}        partialStr partial user input of a command
   * @return {array}                    list of possible text suggestions
   */
  suggest(state: EmulatorState, partialStr: string) {
    partialStr = this._trimLeadingSpace(partialStr);

    const lastPartialChar = partialStr.slice(-1);
    const isTypingNewPart = lastPartialChar === ' ';

    const strParts = partialStr.trim().split(' ');
    const { start: cmdName, end: lastTextEntered } = this._getBoundaryWords(
      strParts
    );

    if (!isTypingNewPart && strParts.length === 1) {
      return suggestCommands(state.getCommandMapping(), cmdName);
    }

    const strToComplete = isTypingNewPart ? '' : lastTextEntered;
    const cwd = getEnvironmentVariable(state.getEnvVariables(), 'cwd') as string;

    return [
      ...suggestCommandOptions(
        state.getCommandMapping(),
        cmdName,
        strToComplete
      ),
      ...suggestFileSystemNames(state.getFileSystem(), cwd, strToComplete)
    ];
  }

  _trimLeadingSpace(str: string) {
    return str.replace(/^\s+/g, '');
  }

  _getBoundaryWords(strParts: string[]) {
    return {
      end: strParts[strParts.length - 1],
      start: strParts[0]
    };
  }

  /**
   * Runs emulator command
   * @param  {EmulatorState}  state                   emulator state before running command
   * @param  {string}         str                     command string to execute
   * @param  {Array}          [executionListeners=[]] list of plugins to notify while running the command
   * @return {EmulatorState}                          updated emulator state after running command
   */
  async execute(
    state: EmulatorState,
    str: string,
    executionListeners: any[] = []
  ) {
    for (const executionListener of executionListeners) {
      executionListener.onExecuteStarted(state, str);
    }

    state = await this._addHeaderOutput(state, str);

    if (str.trim() === '') {
      // empty command string
      state = await this._addCommandOutputs(state, [makeTextOutput('')]);
    } else {
      state = this._addCommandToHistory(state, str);
      state = await this._updateStateByExecution(state, str);
    }

    for (const executionListener of executionListeners) {
      executionListener.onExecuteCompleted(state);
    }

    return state;
  }

  async _updateStateByExecution(
    state: EmulatorState,
    commandStrToExecute: string
  ) {
    for (const { commandName, commandOptions } of parseCommands(
      commandStrToExecute
    )) {
      const commandMapping = state.getCommandMapping();
      const commandArgs = [state, commandOptions] as [EmulatorState, string[]];

      const { state: nextState, output, outputs } = await CommandRunner.run(
        commandMapping,
        commandName,
        commandArgs
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

  _addCommandToHistory(state: EmulatorState, command: string) {
    const history = state.getHistory();

    return state.setHistory(recordCommand(history, command));
  }

  _addHeaderOutput(state: EmulatorState, commandStr: string) {
    const envVariables = state.getEnvVariables();
    const cwd = getEnvironmentVariable(envVariables, 'cwd') as string;

    return this._addCommandOutputs(state, [makeHeaderOutput(cwd, commandStr)]);
  }

  /**
   * Appends outputs to the internal state of outputs
   * @param {EmulatorState} state
   * @param {List} outputs list of outputs
   */
  _addCommandOutputs(state: EmulatorState, outputs: any[]) {
    for (const output of outputs) {
      const _outputs = state.getOutputs();

      state = state.setOutputs(_outputs.push(output));
    }

    return state;
  }

  getHelp(state: EmulatorState, commandName: string) {
    const commandMapping = state.getCommandMapping();

    return commandMapping.get(commandName)!.get('help');
  }
}
