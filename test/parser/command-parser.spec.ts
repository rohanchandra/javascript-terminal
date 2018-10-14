import chai from 'chai';

import parseCommands from 'parser/command-parser';

describe('command-parser', () => {
  it('should parse command with no args', () => {
    const parsedCommands = parseCommands('ls');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'ls',
        commandOptions: []
      }
    ]);
  });

  it('should parse command with single anonymous arg', () => {
    const parsedCommands = parseCommands('ls a');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'ls',
        commandOptions: ['a']
      }
    ]);
  });

  it('should parse command with text after command name', () => {
    const parsedCommands = parseCommands('echo hello world!');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'echo',
        commandOptions: ['hello', 'world!']
      }
    ]);
  });

  it('should parse command with multiple anonymous args', () => {
    const parsedCommands = parseCommands('ls a b c');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'ls',
        commandOptions: ['a', 'b', 'c']
      }
    ]);
  });

  it('should parse command with single flag', () => {
    const parsedCommands = parseCommands('foo --help');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'foo',
        commandOptions: ['--help']
      }
    ]);
  });

  it('should parse command with excess spaces', () => {
    const parsedCommands = parseCommands('                   a     --b      --c');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'a',
        commandOptions: ['--b', '--c']
      }
    ]);
  });

  it('should parse command with tabs instead of spaces', () => {
    const parsedCommands = parseCommands('\u00a0a\u00a0--b\u00a0--c');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'a',
        commandOptions: ['--b', '--c']
      }
    ]);
  });

  it('should parse command with excess tabs', () => {
    const parsedCommands = parseCommands('\u00a0\u00a0\u00a0\u00a0\u00a0a\u00a0\u00a0--b\u00a0\u00a0--c');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'a',
        commandOptions: ['--b', '--c']
      }
    ]);
  });

  it('should parse command with mixed flag and args', () => {
    const parsedCommands = parseCommands('foo --help a/b/c hello.txt -a -h');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'foo',
        commandOptions: ['--help', 'a/b/c', 'hello.txt', '-a', '-h']
      }
    ]);
  });

  it('should parse multiple commands with && and no args', () => {
    const parsedCommands = parseCommands('foo && bar');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'foo',
        commandOptions: []
      }, {
        commandName: 'bar',
        commandOptions: []
      }
    ]);
  });

  it('should parse multiple commands with && and args', () => {
    const parsedCommands = parseCommands('foo -a --help && bar --help -b');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'foo',
        commandOptions: ['-a', '--help']
      }, {
        commandName: 'bar',
        commandOptions: ['--help', '-b']
      }
    ]);
  });

  it('should parse multiple commands with ; and no args', () => {
    const parsedCommands = parseCommands('foo; bar');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'foo',
        commandOptions: []
      }, {
        commandName: 'bar',
        commandOptions: []
      }
    ]);
  });

  it('should parse multiple commands with ; and args', () => {
    const parsedCommands = parseCommands('foo -a --help; bar --help -b');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'foo',
        commandOptions: ['-a', '--help']
      }, {
        commandName: 'bar',
        commandOptions: ['--help', '-b']
      }
    ]);
  });

  it('should parse multiple commands with excess space', () => {
    const parsedCommands = parseCommands('foo    -a --help   ;    bar   --help -b');

    chai.expect(parsedCommands).to.deep.equal([
      {
        commandName: 'foo',
        commandOptions: ['-a', '--help']
      }, {
        commandName: 'bar',
        commandOptions: ['--help', '-b']
      }
    ]);
  });
});
