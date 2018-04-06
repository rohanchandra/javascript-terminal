import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import spies from 'chai-spies';

chai.use(chaiImmutable);
chai.use(spies);

const sandbox = chai.spy.sandbox();

import FS from '../mocks/mock-fs-permissions';
import * as DirectoryOpsPermissioned from 'fs/operations-with-permissions/directory-operations';
import * as DirectoryOps from 'fs/operations/directory-operations';
import * as FileUtil from 'fs/util/file-util';
import { fsErrorType } from 'fs/fs-error';

describe('directory-operations with modification permissions', () => {
  before(() => {
    sandbox.on(DirectoryOps, [
      'hasDirectory',
      'addDirectory',
      'listDirectoryFiles',
      'listDirectoryFolders',
      'listDirectory',
      'deleteDirectory',
      'copyDirectory',
      'renameDirectory'
    ]);
  });

  describe('hasDirectory', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify'];

      DirectoryOpsPermissioned.hasDirectory(...args);
      chai.expect(DirectoryOps.hasDirectory).to.have.been.called.with(...args);
    });
  });

  describe('addDirectory', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify/new', FileUtil.makeDirectory()];

      DirectoryOpsPermissioned.addDirectory(...args);
      chai.expect(DirectoryOps.addDirectory).to.have.been.called.with(...args);
    });

    it('should return permissions error if cannot modify directory', () => {
      const newDir = FileUtil.makeDirectory();
      const {err} = DirectoryOpsPermissioned.addDirectory(FS, '/cannot-modify/new', newDir);

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });
  });

  describe('listDirectoryFiles', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify'];

      DirectoryOpsPermissioned.listDirectoryFiles(...args);
      chai.expect(DirectoryOps.listDirectoryFiles).to.have.been.called.with(...args);
    });
  });

  describe('listDirectoryFolders', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify'];

      DirectoryOpsPermissioned.listDirectoryFolders(...args);
      chai.expect(DirectoryOps.listDirectoryFolders).to.have.been.called.with(...args);
    });
  });

  describe('listDirectory', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify'];

      DirectoryOpsPermissioned.listDirectory(...args);
      chai.expect(DirectoryOps.listDirectory).to.have.been.called.with(...args);
    });
  });

  describe('deleteDirectory', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify', true];

      DirectoryOpsPermissioned.deleteDirectory(...args);
      chai.expect(DirectoryOps.deleteDirectory).to.have.been.called.with(...args);
    });

    it('should return permissions error if cannot modify directory', () => {
      const {err} = DirectoryOpsPermissioned.deleteDirectory(
        FS, '/cannot-modify'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });
  });

  describe('copyDirectory', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify', '/can-modify-secondary', true];

      DirectoryOpsPermissioned.copyDirectory(...args);
      chai.expect(DirectoryOps.copyDirectory).to.have.been.called.with(...args);
    });

    it('should return permissions error if cannot modify source directory', () => {
      const {err} = DirectoryOpsPermissioned.copyDirectory(
        FS, '/cannot-modify', '/can-modify'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });

    it('should return permissions error if cannot modify dest directory', () => {
      const {err} = DirectoryOpsPermissioned.copyDirectory(
        FS, '/can-modify', '/cannot-modify'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });
  });

  describe('renameDirectory', () => {
    it('should use non-permissioned operation with same arguments', () => {
      const args = [FS, '/can-modify', '/can-modify-secondary'];

      DirectoryOpsPermissioned.renameDirectory(...args);
      chai.expect(DirectoryOps.renameDirectory).to.have.been.called.with(...args);
    });

    it('should return permissions error if cannot modify original directory', () => {
      const {err} = DirectoryOpsPermissioned.renameDirectory(
        FS, '/cannot-modify', '/can-modify'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });

    it('should return permissions error if cannot modify renamed directory', () => {
      const {err} = DirectoryOpsPermissioned.renameDirectory(
        FS, '/can-modify', '/cannot-modify'
      );

      chai.expect(err.type).to.equal(fsErrorType.PERMISSION_DENIED);
    });
  });
});
