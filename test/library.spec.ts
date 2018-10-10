import * as chai from 'chai';

import * as Terminal from '../src';

describe('Given the Terminal library', () => {
  it('should define all API functions', () => {
    chai.assert.isDefined(Terminal.Emulator);
    chai.assert.isDefined(new Terminal.Emulator());

    // State API
    chai.assert.isDefined(Terminal.CommandMapping);
    chai.assert.isDefined(Terminal.EnvironmentVariables);
    chai.assert.isDefined(Terminal.Outputs);
    chai.assert.isDefined(Terminal.FileSystem);
    chai.assert.isDefined(Terminal.History);
    chai.assert.isDefined(Terminal.EmulatorState);

    // Output API
    chai.assert.isDefined(Terminal.OutputFactory);
    chai.assert.isDefined(Terminal.OutputType);

    // FS API
    chai.assert.isDefined(Terminal.DirOp);
    chai.assert.isDefined(Terminal.FileOp);

    // Parser API
    chai.assert.isDefined(Terminal.OptionParser);
  });
});
