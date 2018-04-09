![logo](https://user-images.githubusercontent.com/816965/38487336-1d193960-3c23-11e8-8da6-9575b0eac3e9.png)

# JavaScript Terminal

An open-source JavaScript terminal emulator library, that works in your browser and Node.js.

[Demo](https://rohanchandra.gitlab.io/javascript-terminal/demo/)

## Features
* In-memory file system, backed by Immutable.js
* Selected *NIX commands emulated (such as `ls`, `cd`, `head`, `cat`, `echo`, `rm`)
* Command parsing
* Support for environment variables
* Autocompletion of terminal commands

## Installation
Install with `npm` or with `yarn`.

```shell
npm install javascript-terminal --save
```

```shell
yarn add javascript-terminal
```

## Usage

### Creating an emulator

Create a new instance of the terminal emulator:

```javascript
const emulator = new Terminal.Emulator();
const emulatorState = Terminal.EmulatorState.createEmpty();
```

In all examples below, it is assumed that `emulator` and `emulatorState` have been created.

### Running commands
Once you've created the `emulator` and `emulatorState`, you can run commands! `emulator.execute` is used to run a command string from the user, and it returns the **new** emulator state.

```javascript
const commandStr = 'ls';
const plugins = [];

const newEmulatorState = emulator.execute(emulatorState, commandStr, plugins)
```

In the example above, `newEmulatorState` now contains the updated emulator state after the side-effects of running the `ls` command string.

You can then see the updated outputs using:

```javascript
newEmulatorState.getOutputs()
```

Putting everything together, you now have enough knowledge to build a simple terminal emulator in Node.js! Check out the [demo code](https://github.com/rohanchandra/javascript-terminal/tree/master/demo-cli), or keep reading for more advanced features.

### Autocomplete

The terminal can autocomplete user input using a partial command, filename or folder name.

Call `emulator.autocomplete` with the `emulatorState` and a partially completed string to get autocompleted text. If no autocompletion can be made, the original string is returned.

```javascript
const partialString = 'ech';

emulator.autocomplete(emulatorState, partialString); // autocompletes to 'echo'
```

### History iteration

The history of the terminal can be navigated using a keyboard.

**Create History Keyboard Plugin**
To enable history iteration, create the history keyboard plugin.

```javascript
const historyKeyboardPlugin = new Terminal.HistoryKeyboardPlugin(emulatorState);
```

**Updating History Keyboard Plugin**
When running a command, provide the history keyboard plugin in the call to `emulator.execute`:

```javascript
const commandStr = 'ls'; // commandStr contains the user input

emulator.execute(emulatorState, commandStr, [historyKeyboardPlugin]);
```

This ensures that the history keyboard plugin has the latest state required for history iteration.

**Iteration**
When the user presses the up key call `completeUp()`.

```javascript
historyKeyboardPlugin.completeUp() // returns string from history stack
```

When the user presses the down key call `completeDown()` .

```javascript
historyKeyboardPlugin.completeDown() // returns string from history stack
```

### Emulator state

The emulator state encapsulates the stateful elements of the emulator: the file system, command mapping, history, outputs and environment variables.

The default emulator state is created with `createEmpty()`.

```javascript
const emulatorState = Terminal.EmulatorState.createEmpty();
```

Elements of the emulator state can be accessed and updated during runtime using the getters and setters:
* `getFileSystem()` and `setFileSystem(newFileSystem)`
* `getEnvVariables()` and `setEnvVariables(newEnvVariables)`
* `getHistory()` and `setHistory(newHistory)`
* `getOutputs()` and `setOutputs(newOutputs)`
* `getCommandMapping()` and `setCommandMapping(newCommandMapping)`

Using a setter returns a new instance of the emulator state.

For example:

```javascript
const defaultState = Terminal.EmulatorState.createEmpty();
const defaultOutputs = defaultState.getOutputs();

const newOutputs = Terminal.Outputs.addRecord(
  defaultOutputs, Terminal.OutputFactory.makeTextOutput('added output')
);
const emulatorState = defaultState.setOutputs(newOutputs);
```

Notice how setting the new outputs with `setOutputs` returns **new** `emulatorState` by updating the old `defaultState`.

### Customising the emulator state

To create emulator state with customised elements (e.g. a custom file system), use a JavaScript object with `create()` which conforms to the following object schema.

```javascript
const emulatorState = Terminal.EmulatorState.create({
  'fs': customFileSystem,
  'environmentVariables': customEnvVariables,
  'history': customHistory,
  'outputs': customOutputs,
  'commandMapping': customCommandMapping
})
```

The JavaScript object only needs to have the keys of the element you wish to adjust. Default elements will be used as a fallback. For example, if you only need a custom file system your code would look this this:

```javascript
const emulatorState = Terminal.EmulatorState.create({
  'fs': customFileSystem
})
```

Examples of creating and modifying custom elements follow.

##### File system
`Terminal.FileSystem` allows the creation of an in-memory file system with `create` using a JavaScript object.

Files and directories should be represented using a JavaScript object. File objects are differentiated from directories by use of a `content` key.

`canModify: false` in the object can be used to prevent modification of the file system object (such as deletion or renaming) of the file/directory and its children files/directories (if any).

```javascript
const customFileSystem = Terminal.FileSystem.create({
  '/home': { },
  '/home/README': {content: 'This is a text file', canModify: false},
  '/home/nested/directory/file': {content: 'End of nested directory!'}
});

// Using a custom operation
const isHomeDefined = Terminal.DirOp.hasDirectory(customFileSystem, '/home')
```

The created file system (in `customFileSystem`) can be read or modified using a `DirOp` or `FileOp` (see the source code for JSDoc comments explaining each operation).

##### Command mapping

The command mapping can be used to add a new command to the terminal.

Here us an example of adding a command to print the contents of the arguments:

```javascript
const customCommandMapping = Terminal.CommandMapping.create({
  ...Terminal.defaultCommandMapping,
  'print': {
    'function': (state, opts) => {
      const input = opts.join(' ');

      return {
        output: OutputFactory.makeTextOutput(input)
      };
    },
    'optDef': {}
  }
});
```

For more advanced source code examples of how commands are defined view the `commands` directory.

##### History

History contains a list of previously run commands. The list can be displayed to the user using the `history` command.

```javascript
const customHistory = Terminal.History.create(['a', 'b']);
```

##### Outputs

Outputs contains a list which contains all emulator output including text output, error output and command headers. These outputs are intended to be visible to the user.

If a command has output, it will be appended to the outputs list.

```javascript
const textOutput = Terminal.OutputFactory.makeTextOutput(
  `This is an example of adding an output to display to the user without running any command.`
);

const customOutputs = Terminal.Outputs.create([textOutput]);
```

##### Environment variables

Environment variables can be accessed by a command or the user (for example, by using the `echo` command).

```javascript
const defaultEnvVariables = Terminal.EnvironmentVariables.create();
const customEnvVariables = Terminal.EnvironmentVariables.setEnvironmentVariable(
  defaultEnvVariables, 'CUSTOM_ENV_VARIABLE', 'this is the value'
);
```

### Examples
This library does not prescribe a method for displaying terminal output or the user interface, so I've provided examples in Node.js, pure JavaScript/HTML/CSS and with React/JavaScript/HTML/CSS:

1. View the `/demo-cli` directory for an example of usage in Node.js
2. View the `/demo-web` directory for an example of usage in plain HTML and JavaScript
3. Visit the [React Terminal Component website](https://github.com/rohanchandra/react-terminal-component) for usage with HTML, CSS, JavaScript and React

## Building

### Set-up

First, make sure you have  [Node.js](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/en/docs/install) and [Git](https://git-scm.com/downloads) installed.

Now, fork and clone repo and install the dependencies.

```shell
git clone https://github.com/rohanchandra/javascript-terminal.git
cd javascript-terminal/
yarn install
```

### Scripts

#### Build scripts
* `yarn build`  - creates a development and production build of the library in `lib`

#### Test scripts
* `yarn test` - run tests
* `yarn test:min` - run tests with summary reports
* `yarn test:coverage` - shows test coverage stats
* `yarn artifact:coverage-report` - creates [HTML test coverage report](https://rohanchandra.gitlab.io/javascript-terminal/coverage/)  in `.nyc_output`

#### Demo scripts
* `yarn cli` - demo of using the emulator library in a Node.js command-line interface (this requires you have built the library with `yarn build`)

## License

Copyright 2018 Rohan Chandra

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
