import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import * as BaseOp from 'fs/operations/base-operations';
import { fsErrorType } from 'fs/fs-error';
import { create as createFileSystem } from 'emulator-state/file-system';

describe('base-operations', () => {
  describe('add', () => {
    it('should add file system object to root', () => {
      const emptyFS = createFileSystem({});
      const {fs} = BaseOp.add(emptyFS, '/', 'added path');

      chai.expect(fs).to.equal(
        createFileSystem({'/': 'added path'})
      );
    });

    it('should add file system object to nested path', () => {
      const emptyFS = createFileSystem({'/': {}});
      const {fs} = BaseOp.add(emptyFS, '/a', 'added path');

      chai.expect(fs).to.equal(
        createFileSystem({'/a': 'added path'})
      );
    });

    it('should return error if root path already exists', () => {
      const rootFS = createFileSystem({'/': {}});

      const {err} = BaseOp.add(rootFS, '/', 'added path');

      chai.expect(err.type).to.equal(fsErrorType.FILE_OR_DIRECTORY_EXISTS);
    });

    it('should return error adding path (or directory) to a file', () => {
      const rootFS = createFileSystem({'/folderName/fileName': {content: 'file content'}});

      const {
        err: withAddParentPathsErr
      } = BaseOp.add(rootFS, '/folderName/fileName/newFolder', 'added path');

      const {
        err: withoutAddParentPathsErr
      } = BaseOp.add(rootFS, '/folderName/fileName/newFolder', 'added path', true);

      chai.expect(withAddParentPathsErr.type).to.equal(fsErrorType.NOT_A_DIRECTORY);
      chai.expect(withoutAddParentPathsErr.type).to.equal(fsErrorType.NOT_A_DIRECTORY);
    });

    it('should return error if non-root path already exists', () => {
      const fs = createFileSystem({'/a/b/c': {}});

      const {err} = BaseOp.add(fs, '/a/b', 'added path');

      chai.expect(err.type).to.equal(fsErrorType.FILE_OR_DIRECTORY_EXISTS);
    });

    it('should return error if parent path does not exist', () => {
      const fs = createFileSystem({'/a': {}});

      const {err} = BaseOp.add(fs, '/a/noParent/newDir', 'added path');

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
    });

    it('should add path if parent path does not exist but option set to create parent paths', () => {
      const fs = createFileSystem({'/a': {}});

      const {fs: newFS} = BaseOp.add(fs, '/a/noParent/newDir', 'added path', true);

      chai.expect(newFS).to.equal(
        createFileSystem({
          '/a': {},
          '/a/noParent': {},
          '/a/noParent/newDir': 'added path'
        })
      );
    });
  });

  describe('remove', () => {
    const removalFS = createFileSystem({
      '/': {},
      '/subdir': {},
      '/subdir/file': {content: 'file content'}
    });

    it('should remove root', () => {
      const {fs} = BaseOp.remove(removalFS, '/');

      chai.expect(fs).to.equal(createFileSystem({}));
    });

    it('should remove file', () => {
      const {fs} = BaseOp.remove(removalFS, '/subdir/file');

      chai.expect(fs).to.equal(createFileSystem({
        '/': {},
        '/subdir': {}
      }));
    });

    it('should remove subdirectory', () => {
      const {fs} = BaseOp.remove(removalFS, '/subdir');

      chai.expect(fs).to.equal(createFileSystem({
        '/': {}
      }));
    });

    it('should return error if path does not exist', () => {
      const {err} = BaseOp.remove(removalFS, '/noSuchDirectory');

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_FILE_OR_DIRECTORY);
    });

    it('should return error cannot remove non-empty directories', () => {
      const {err} = BaseOp.remove(removalFS, '/subdir', false);

      chai.expect(err.type).to.equal(fsErrorType.DIRECTORY_NOT_EMPTY);
    });
  });
});
