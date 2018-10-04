/* global beforeEach */
import chai from '../_plugins/state-equality-plugin';
import { List } from 'immutable';

import Emulator from 'emulator';
import EmulatorState from 'emulator-state/EmulatorState';
import { create as createOutputs } from 'emulator-state/outputs';
import { create as createCommandMapping } from 'emulator-state/command-mapping';
import { create as createFileSystem } from 'emulator-state/file-system';
import { makeHeaderOutput, makeTextOutput } from 'emulator-output/output-factory';

const emptyState = EmulatorState.createEmpty();

const testCommandState = EmulatorState.create({
  commandMapping: createCommandMapping({
    'setsEmptyState': {
      function: (state, commandOptions) => ({
        state: emptyState
      }),
      optDef: {}
    },
    'setsOutputs': {
      function: (state, commandOptions) => ({
        outputs: [makeTextOutput('hello')]
      }),
      optDef: {}
    },
    'setsSingleOutput': {
      function: (state, commandOptions) => ({
        output: makeTextOutput('hello')
      }),
      optDef: {}
    },
    'setsEmptyStateAndOutputs': {
      function: (state, commandOptions) => ({
        state: emptyState,
        outputs: [makeTextOutput('hello')]
      }),
      optDef: {}
    },
    'usesArguments': {
      function: (state, commandOptions) => ({
        outputs: commandOptions.map((opt) => makeTextOutput(opt))
      }),
      optDef: {}
    }
  })
});

let emulator;

describe('emulator', () => {
  beforeEach(() => {
    emulator = new Emulator();
  });

  it('should update state from command', async () => {
    const newState = await emulator.execute(testCommandState, 'setsEmptyState');

    chai.expect(newState).toEqualState(emptyState);
  });

  it('should add emtpy text output and header if running empty command',async  () => {
    const newState = await emulator.execute(testCommandState, '');

    chai.expect([...newState.getOutputs()]).to.deep.equal(
      [
        makeHeaderOutput('/', ''),
        makeTextOutput('')
      ]
    );
  });

  describe('emulator output',  () => {
    it('should update outputs from command with list output', async () => {
      const newState = await emulator.execute(testCommandState, 'setsOutputs');

      chai.expect([...newState.getOutputs()]).to.deep.equal(
        [
          makeHeaderOutput('/', 'setsOutputs'),
          makeTextOutput('hello')
        ]
      );
    });

    it('should update outputs from command with single output', async () => {
      const newState = await emulator.execute(testCommandState, 'setsSingleOutput');

      chai.expect([...newState.getOutputs()]).to.deep.equal(
        [
          makeHeaderOutput('/', 'setsSingleOutput'),
          makeTextOutput('hello')
        ]
      );
    });

    it('should update state and outputs from command', async () => {
      const newState = await emulator.execute(testCommandState, 'setsEmptyStateAndOutputs');

      chai.expect(newState).toEqualState(EmulatorState.create({
        outputs: createOutputs([makeTextOutput('hello')])
      }));
    });

    it('should access parsed args from command', async () => {
      const newState = await emulator.execute(testCommandState, 'usesArguments --a1 b2 c3 d/e/f');

      chai.expect([...newState.getOutputs()]).to.deep.equal(
        [
          makeHeaderOutput('/', 'usesArguments --a1 b2 c3 d/e/f'),
          makeTextOutput('--a1'),
          makeTextOutput('b2'),
          makeTextOutput('c3'),
          makeTextOutput('d/e/f')
        ]
      );
    });
  });

  describe('emulator history', () => {
    it('should update history', async () => {
      let newState = await emulator.execute(testCommandState, 'baz && foo');

      newState = await emulator.execute(newState, 'bar');

      chai.expect(newState.getHistory()).to.equal(
        List(['bar', 'baz && foo'])
      );
    });
  });

  describe('suggest and autocomplete', () => {
    const testState = EmulatorState.create({
      commandMapping: createCommandMapping({
        'commandOne': {
          function: () => {},
          optDef: {
            '-e, --example': '',
            '-g, --egg': ''
          }
        },
        'commandTwo': {
          function: () => {},
          optDef: {}
        }
      }),
      fs: createFileSystem({
        '/spam/eggs/ham/bacon': {},
        '/spam/eggs/foo': {}
      })
    });

    describe('suggest', () => {
      it('should suggest commands with empty input string', () => {
        const suggestions = emulator.suggest(testState, '');

        chai.expect(suggestions).to.deep.equal(
          ['commandOne', 'commandTwo']
        );
      });

      it('should suggest commands with partial input string', () => {
        const suggestions = emulator.suggest(testState, 'co');

        chai.expect(suggestions).to.deep.equal(
          ['commandOne', 'commandTwo'],
        );
      });

      it('should suggest fs paths + commands options with command and space', () => {
        const suggestions = emulator.suggest(testState, 'commandOne ');

        chai.expect(suggestions).to.deep.equal(
          ['-e', '--example', '-g', '--egg', 'spam'],
        );
      });

      it('should suggest fs paths + commands options with partial input string', () => {
        const suggestions = emulator.suggest(testState, 'commandTwo sp');

        chai.expect(suggestions).to.deep.equal(
          ['spam']
        );
      });
    });

    describe('autocomplete', () => {
      it('should not autocomplete with multiple matches', () => {
        const suggestions = emulator.autocomplete(testState, '');

        chai.expect(suggestions).to.equal('');
      });

      it('should autocomplete with single command name match', () => {
        const suggestions = emulator.autocomplete(testState, 'commandT');

        chai.expect(suggestions).to.equal('commandTwo');
      });

      it('should autocomplete with single file system match', () => {
        const suggestions = emulator.autocomplete(testState, 'commandTwo sp');

        chai.expect(suggestions).to.equal('commandTwo spam');
      });

      it('should autocomplete argument', () => {
        const suggestions = emulator.autocomplete(testState, 'commandOne spam --ex');

        chai.expect(suggestions).to.equal('commandOne spam --example');
      });

      it('should autocomplete single file', () => {
        const singleFileTestState = EmulatorState.create({
          fs: createFileSystem({
            '/foo': {}
          })
        });

        const suggestions = emulator.autocomplete(singleFileTestState, 'cd ');

        chai.expect(suggestions).to.equal('cd foo');
      });

      it('should autocomplete file system at end of string', () => {
        const suggestions = emulator.autocomplete(testState, 'commandTwo spam /spam/e');

        chai.expect(suggestions).to.equal('commandTwo spam /spam/eggs');
      });
    });
  });
});
