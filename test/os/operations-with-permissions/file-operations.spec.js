import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import spies from 'chai-spies';

chai.use(chaiImmutable);
chai.use(spies);

const sandbox = chai.spy.sandbox();

import FS from '../mocks/mock-fs-permissions';
import * as FileOpsPermissioned from 'fs/operations-with-permissions/file-operations';
import * as FileOps from 'fs/operations/file-operations';
import * as FileUtil from 'fs/util/file-util';
import { fsErrorType } from 'fs/fs-error';

describe('file-operations with modification permissions', () => {
  before(() => {
    sandbox.on(FileOps, [
      'hasFile',
      'readFile',
      'writeFile',
      'copyFile',
      'deleteFile'
    ]);
  });

  describe('hasFile', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify/can-modify-file'];

      FileOpsPermissioned.hasFile(...args);
      chai.expect(FileOps.hasFile).to.have.been.called.with(...args);
    });
  });

  describe('readFile', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify/can-modify-file'];

      FileOpsPermissioned.readFile(...args);
      chai.expect(FileOps.readFile).to.have.been.called.with(...args);
    });
  });

  describe('writeFile', () => {
    const NEW_FILE = FileUtil.makeFile();

    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify/new-file', NEW_FILE];

      FileOpsPermissioned.writeFile(...args);
      chai.expect(FileOps.writeFile).to.have.been.called.with(...args);
    });

    it('should return permissions error if cannot modify directory', () => {
      const {err} = FileOpsPermissioned.writeFile(
        FS, '/cannot-modify/new-file', NEW_FILE
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });

    it('should return permissions error if cannot modify file', () => {
      const {err} = FileOpsPermissioned.writeFile(
        FS, '/can-modify/cannot-modify-file', NEW_FILE
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });
  });

  describe('copyFile', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify/can-modify-file', '/can-modify/dest-file'];

      FileOpsPermissioned.copyFile(...args);
      chai.expect(FileOps.copyFile).to.have.been.called.with(...args);
    });

    it('should return permissions error if cannot modify source directory', () => {
      const {err} = FileOpsPermissioned.copyFile(
        FS, '/cannot-modify/new-file', '/can-modify/dest-file'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });

    it('should return permissions error if cannot modify source file', () => {
      const {err} = FileOpsPermissioned.copyFile(
        FS, '/can-modify/cannot-modify-file', '/can-modify/dest-file'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });

    it('should return permissions error if cannot modify dest directory', () => {
      const {err} = FileOpsPermissioned.copyFile(
        FS, '/can-modify/new-file', '/cannot-modify/dest-file'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });

    it('should return permissions error if cannot modify dest file', () => {
      const {err} = FileOpsPermissioned.copyFile(
        FS, '/can-modify/new-file', '/can-modify/cannot-modify-file'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });
  });

  describe('deleteFile', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify/can-modify-file'];

      FileOpsPermissioned.deleteFile(...args);
      chai.expect(FileOps.deleteFile).to.have.been.called.with(...args);
    });

    it('should return permissions error if cannot modify directory', () => {
      const {err} = FileOpsPermissioned.deleteFile(
        FS, '/cannot-modify/can-modify-file'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });

    it('should return permissions error if cannot modify file', () => {
      const {err} = FileOpsPermissioned.deleteFile(
        FS, '/can-modify/cannot-modify-file'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });
  });
});
