import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import { Seq, Map } from 'immutable';

chai.use(chaiImmutable);

import * as CommandMapping from 'emulator-state/command-mapping';

describe('command-mapping', () => {
  const emptyCommandMapping = CommandMapping.create({});

  describe('create', () => {
    it('should exist', () => {
      chai.assert.isFunction(CommandMapping.create);
    });

    it('should create an immutable map', () => {
      chai.expect(emptyCommandMapping).to.be.instanceOf(Map);
    });

    it('should create command map from JS object', () => {
      const cmdMapping = CommandMapping.create({
        'a': {
          function: () => true,
          optDef: {}
        }
      });

      chai.expect(CommandMapping.getCommandFn(cmdMapping, 'a')()).to.equal(true);
    });

    it('should throw error if missing command function', () => {
      const jsMapping = {
        'a': {
          optDef: {}
        }
      };

      chai.expect(() => CommandMapping.create(jsMapping)).to.throw();
    });

    it('should throw error if missing option definition', () => {
      const jsMapping = {
        'a': {
          function: () => true
        }
      };

      chai.expect(() => CommandMapping.create(jsMapping)).to.throw();
    });
  });

  describe('isCommandSet', () => {
    const commandMapping = CommandMapping.create({
      'hello': {
        function: () => {},
        optDef: {}
      }
    });

    it('should exist', () => {
      chai.assert.isFunction(CommandMapping.isCommandSet);
    });

    it('should return true if command exists', () => {
      chai.expect(
        CommandMapping.isCommandSet(commandMapping, 'hello')
      ).to.equal(true);
    });

    it('should return false if command does not exist', () => {
      chai.expect(
        CommandMapping.isCommandSet(commandMapping, 'noSuchCommand')
      ).to.equal(false);
    });
  });

  describe('setCommand', () => {
    it('should exist', () => {
      chai.assert.isFunction(CommandMapping.setCommand);
    });

    it('should add a command to an existing mapping', () => {
      const commandMapping = CommandMapping.create({
        'foo': {
          function: () => {},
          optDef: {}
        }
      });

      const addedFunction = () => true;

      const actualMapping = CommandMapping.setCommand(
        commandMapping, 'baz', addedFunction, {}
      );

      const expectedMapping = CommandMapping.create({
        'foo': {
          function: () => {},
          optDef: {}
        },
        'baz': {
          function: addedFunction,
          optDef: {}
        }
      });

      chai.expect(actualMapping.keySeq()).to.equal(expectedMapping.keySeq());
      chai.expect(actualMapping.get('baz')).to.equal(expectedMapping.get('baz'));
    });

    it('should override a command if it already is defined', () => {
      const commandMapping = CommandMapping.create({
        'baz': {
          function: () => false,
          optDef: {'c': 'd'}
        }
      });

      const actualMapping = CommandMapping.setCommand(
        commandMapping, 'baz', () => true, {'a': 'b'}
      );

      const expectedMapping = CommandMapping.create({
        'baz': {
          function: () => true,
          optDef: {'a': 'b'}
        }
      });

      chai.expect(actualMapping.keySeq()).to.equal(expectedMapping.keySeq());
    });

    it('should add a command to empty mapping', () => {
      const actualMapping = CommandMapping.setCommand(
        emptyCommandMapping, 'baz', () => true, {}
      );

      const expectedMapping = CommandMapping.create({
        'baz': {
          function: () => true,
          optDef: {}
        }
      });

      chai.expect(actualMapping.keySeq()).to.equal(expectedMapping.keySeq());
    });

    it('should throw error if missing option definition', () => {
      chai.expect(() =>
        CommandMapping.setCommand(
          emptyCommandMapping, 'baz', () => true, undefined
        )
      ).to.throw();
    });

    it('should throw error if missing function', () => {
      chai.expect(() =>
        CommandMapping.setCommand(
          emptyCommandMapping, 'baz', undefined, {}
        )
      ).to.throw();
    });
  });

  describe('unsetCommand', () => {
    it('should exist', () => {
      chai.assert.isFunction(CommandMapping.unsetCommand);
    });

    it('should remove a command which is set', () => {
      const commandMapping = CommandMapping.create({
        'hello': {
          function: () => {},
          optDef: {}
        }
      });

      chai.expect(
        CommandMapping.unsetCommand(commandMapping, 'hello')
      ).to.equal(emptyCommandMapping);
    });

    it('should ignore removal if command does not exist', () => {
      chai.expect(
        CommandMapping.unsetCommand(emptyCommandMapping, 'noSuchCommand')
      ).to.equal(emptyCommandMapping);
    });
  });

  describe('getCommandFn', () => {
    it('should exist', () => {
      chai.assert.isFunction(CommandMapping.getCommandFn);
    });

    it('should return function which is set', () => {
      const commandMapping = CommandMapping.create({
        'hello': {
          function: () => true,
          optDef: {}
        },
        'goodbye': {
          function: () => false,
          optDef: {}
        }
      });

      const extractedFn = CommandMapping.getCommandFn(commandMapping, 'hello');

      chai.expect(extractedFn()).to.equal(true);
    });

    it('should return undefined if function is not set', () => {
      chai.expect(
        CommandMapping.getCommandFn(emptyCommandMapping, 'noSuchFunction')
      ).to.equal(undefined);
    });
  });

  describe('getCommandOptDef', () => {
    it('should exist', () => {
      chai.assert.isFunction(CommandMapping.getCommandOptDef);
    });

    it('should return function which is set', () => {
      const commandMapping = CommandMapping.create({
        'hello': {
          function: () => true,
          optDef: {'key': 'value'}
        }
      });

      const actualOptDef = CommandMapping.getCommandOptDef(commandMapping, 'hello');

      chai.expect(actualOptDef).to.equal(new Map({'key': 'value'}));
    });

    it('should return undefined if function is not set', () => {
      chai.expect(
        CommandMapping.getCommandOptDef(emptyCommandMapping, 'noSuchFunction')
      ).to.equal(undefined);
    });
  });

  describe('getCommandNames', () => {
    const commandMapping = CommandMapping.create({
      'a': {
        function: () => {},
        optDef: {}
      },
      'b': {
        function: () => {},
        optDef: {}
      },
      'c': {
        function: () => {},
        optDef: {}
      }
    });

    it('should exist', () => {
      chai.assert.isFunction(CommandMapping.getCommandNames);
    });

    it('should return sequence of command names', () => {
      chai.expect(
        CommandMapping.getCommandNames(commandMapping)
      ).to.equal(Seq(['a', 'b', 'c']));
    });
  });
});
