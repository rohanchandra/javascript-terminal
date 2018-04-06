import EmulatorState from 'emulator-state/EmulatorState';
import { create as createFileSystem } from 'emulator-state/file-system';

export const makeFileSystemTestState = (jsFS) => EmulatorState.create({
  fs: createFileSystem(jsFS)
});
