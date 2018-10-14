import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import commandMapping, { commandNames } from '../../../src/commands';

describe('commands', () => {
  describe('default command mapping', () => {
    it('should have all command functions', () => {
      for (const commandName of commandNames) {
        const cmd = commandMapping[commandName];

        chai.assert.isFunction(cmd.function);
        chai.assert.isObject(cmd.optDef);
      }
    });
  });
});
