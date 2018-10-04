import { create as createCommandMapping } from 'emulator-state/command-mapping';
import chai from 'chai';

import { run } from 'emulator/command-runner';
import { emulatorErrorType } from 'emulator/emulator-error';

describe('command-runner', () => {
  describe('run', () => {
    it('should exist', () => {
      chai.assert.isFunction(run);
    });

    it('should run command from command mapping with no args', async () => {
      const commandMapping = createCommandMapping({
        returnTrue: {
          function: () => {return true;},
          optDef: {}
        }
      });

      chai.expect(
        await run(commandMapping, 'returnTrue', [])
      ).to.equal(true);
    });

    it('should run command from command mapping with args', async() => {
      const commandMapping = createCommandMapping({
        sum: {
          function: (a, b) => {return a + b;},
          optDef: {}
        }
      });

      chai.expect(
        await run(commandMapping, 'sum', [40, 2])
      ).to.equal(42);
    });

    it('should raise unexpected command failure internal error if command throws error', async() => {
      const commandMapping = createCommandMapping({
        throwsError: {
          function: () => {throw new Error('Unhandled error');},
          optDef: {}
        }
      });

      const {output} = await run(commandMapping, 'throwsError', []);

      chai.expect(output.content).to.include(emulatorErrorType.UNEXPECTED_COMMAND_FAILURE);
    });

    it('should raise no command error if command not in mapping', async() => {
      const commandMapping = createCommandMapping({});

      const {output} = await run(commandMapping, 'noSuchKey', []);

      chai.expect(output.content).to.include(emulatorErrorType.COMMAND_NOT_FOUND);
    });
  });
});
