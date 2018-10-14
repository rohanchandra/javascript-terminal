import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import FS from '../mocks/mock-fs-permissions';
import * as PermissionUtil from 'fs/util/permission-util';

describe('file-operations', () => {
  describe('directories', () => {
    it('should return false if root directory is not readable', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/cannot-modify')
      ).to.equal(false);
    });

    it('should return false if parent directory is not readable', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/cannot-modify/can-modify')
      ).to.equal(false);
    });

    it('should return true if directory is readable', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/can-modify')
      ).to.equal(true);
    });

    it('should return true if directory does not exist', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/no-directory')
      ).to.equal(true);
    });
  });

  describe('files', () => {
    it('should return false can modify file but cannot modify dir', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/cannot-modify/can-modify-file')
      ).to.equal(false);
    });

    it('should return false cannot modify file and cannot modify dir', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/cannot-modify/cannot-modify-file')
      ).to.equal(false);
    });

    it('should return false if cannot write parent directory', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/cannot-modify/can-modify/can-modify-file')
      ).to.equal(false);
    });

    it('should return false if can modify dir but cannot modify file', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/can-modify/cannot-modify-file')
      ).to.equal(false);
    });

    it('should return true if can modify file and dir', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/can-modify/can-modify-file')
      ).to.equal(true);
    });

    it('should return true if missing file', () => {
      chai.expect(
        PermissionUtil.canModifyPath(FS, '/can-modify', 'no-such-file')
      ).to.equal(true);
    });

  });
});
