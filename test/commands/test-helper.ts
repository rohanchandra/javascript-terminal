import EmulatorState from '../../src/emulator-state/EmulatorState';
import { create as createFileSystem } from '../../src/emulator-state/file-system';

export const makeFileSystemTestState = (jsFS: object) =>
  EmulatorState.create({
    fs: createFileSystem(jsFS)
  });
