import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import * as DirOp from 'fs/operations/directory-operations';
import * as FileUtil from 'fs/util/file-util';
import { fromJS } from 'immutable';
import { fsErrorType } from 'fs/fs-error';
import { create as createFileSystem } from 'emulator-state/file-system';

import {
  PRIMARY_FOLDER_PATH, PRIMARY_FOLDER_FILES, PRIMARY_SUBFOLDER_PATH, PRIMARY_FILE_PATH,
  SECONDARY_FOLDER_PATH,
  MOCK_FS, MOCK_FS_EXC_SECONDARY_FOLDER
} from '../mocks/mock-fs';

describe('directory-operations', () => {
  describe('fillGaps', () => {
    it('should fill directory gaps given only file path', () => {
      const gapFS = fromJS({
        '/a/b/c': {content: 'content'}
      });

      chai.expect(DirOp.fillGaps(gapFS)).to.equal(fromJS({
        '/': {},
        '/a': {},
        '/a/b': {},
        '/a/b/c': {content: 'content'}
      }));
    });

    it('should fill directory gaps given only directory path', () => {
      const gapFS = fromJS({
        '/a/b': {}
      });

      chai.expect(DirOp.fillGaps(gapFS)).to.equal(fromJS({
        '/': {},
        '/a': {},
        '/a/b': {}
      }));
    });

    it('should not mutate existing paths', () => {
      const gapFS = fromJS({
        '/': {metadata: 'root'},
        '/a': {metadata: 'metadata'},
        '/a/b/c': {content: 'content'}
      });

      chai.expect(DirOp.fillGaps(gapFS)).to.equal(fromJS({
        '/': {metadata: 'root'},
        '/a': {metadata: 'metadata'},
        '/a/b': {},
        '/a/b/c': {content: 'content'}
      }));
    });
  });

  describe('hasDirectory', () => {
    it('should return true if directory is present', () => {
      chai.expect(DirOp.hasDirectory(MOCK_FS, PRIMARY_FOLDER_PATH)).to.equal(true);
    });

    it('should return true for root', () => {
      chai.expect(DirOp.hasDirectory(MOCK_FS, '/')).to.equal(true);
    });

    it('should return false if directory is not present', () => {
      chai.expect(DirOp.hasDirectory(MOCK_FS, '/noSuchDirectory')).to.equal(false);
    });
  });

  describe('addDirectory', () => {
    const NEW_DIR = FileUtil.makeDirectory();

    it('should make new directory and new parent directories', () => {
      const expectedFs = createFileSystem({
        '/': {},
        '/my': {},
        '/my/new': {},
        '/my/new/dir': {}
      });

      const {fs: actualFs} = DirOp.addDirectory(
        createFileSystem(), '/my/new/dir', NEW_DIR, true
      );

      chai.expect(actualFs).to.equal(expectedFs);
    });

    it('should add new directory to root', () => {
      const expectedFs = createFileSystem({
        '/': {},
        '/newDirectory': {}
      });

      const {fs: actualFs} = DirOp.addDirectory(
        createFileSystem(), '/newDirectory', NEW_DIR
      );

      chai.expect(actualFs).to.equal(expectedFs);
    });

    it('should throw error if adding directory without parent directories made', () => {
      const {err} = DirOp.addDirectory(
        createFileSystem(), '/noSuchDir/newDir', NEW_DIR, false
      );

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
    });

    it('should throw error if adding directory that already exists', () => {
      const {err} = DirOp.addDirectory(MOCK_FS, PRIMARY_FOLDER_PATH, NEW_DIR);

      chai.expect(err.type).to.equal(fsErrorType.FILE_OR_DIRECTORY_EXISTS);
    });

    it('should throw error if adding a directory to a file', () => {
      const {err} = DirOp.addDirectory(
        MOCK_FS, `${PRIMARY_FILE_PATH}/newDirectory`, false
      );

      chai.expect(err.type).to.equal(fsErrorType.FILE_EXISTS);
    });
  });

  describe('listing directory contents', () => {
    const listDirectoryFilesArray = (...args) => {
      const {list} = DirOp.listDirectoryFiles(...args);

      return [...list];
    };

    const listDirectoryFoldersArray = (...args) => {
      const {list} = DirOp.listDirectoryFolders(...args);

      return [...list];
    };

    const listDirectoryArray = (...args) => {
      const {list} = DirOp.listDirectory(...args);

      return [...list];
    };

    describe('listDirectoryFiles', () => {
      it('should not throw error in empty directory', () => {
        const actualFileNames = listDirectoryFilesArray(MOCK_FS, '/');

        chai.expect(actualFileNames).to.deep.equal([]);
      });

      it('should list files in directory', () => {
        const actualFileNames = listDirectoryFilesArray(MOCK_FS, PRIMARY_FOLDER_PATH);

        chai.expect(actualFileNames).to.deep.equal(PRIMARY_FOLDER_FILES);
      });

      it('should list files in root', () => {
        const actualFileNames = listDirectoryFilesArray(createFileSystem({
          '/': {},
          '/bar': {content: 'bar'},
          '/baz': {content: 'baz'},
          '/subDirectory': {}
        }), '/');

        chai.expect(actualFileNames).to.deep.equal(['bar', 'baz']);
      });

      it('should throw error if directory does not exist', () => {
        const {
          err
        } = DirOp.listDirectoryFiles(MOCK_FS, '/noSuchDirectory');

        chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
      });
    });

    describe('listDirectoryFolders', () => {
      it('should list folder names given directory path', () => {
        const actualFolderNames = listDirectoryFoldersArray(MOCK_FS, PRIMARY_FOLDER_PATH, false);

        chai.expect(actualFolderNames).to.deep.equal(['subfolder']);
      });

      it('should list folder names in root', () => {
        const actualFileNames = listDirectoryFoldersArray(createFileSystem({
          '/': {},
          '/bar': {content: 'bar'},
          '/baz': {content: 'baz'},
          '/subDirectory': {}
        }), '/', false);

        chai.expect(actualFileNames).to.deep.equal(['subDirectory']);
      });

      it('should append trailing / to folders if given argument', () => {
        const actualFolderNames = listDirectoryFoldersArray(MOCK_FS, PRIMARY_FOLDER_PATH, true);

        chai.expect(actualFolderNames).to.deep.equal(['subfolder/']);
      });

      it('should append trailing / to folders as default behaviour', () => {
        const actualFolderNames = listDirectoryFoldersArray(MOCK_FS, PRIMARY_FOLDER_PATH);

        chai.expect(actualFolderNames).to.deep.equal(['subfolder/']);
      });

      it('should list folder names ignoring nested folder names', () => {
        const actualFolderNames = listDirectoryFoldersArray(MOCK_FS, '/', false);

        chai.expect(actualFolderNames).to.deep.equal(['primary', 'secondary']);
      });

      it('should not throw error in empty directory', () => {
        const actualFolderNames = listDirectoryFoldersArray(MOCK_FS, PRIMARY_SUBFOLDER_PATH, false);

        chai.expect(actualFolderNames).to.deep.equal([]);
      });

      it('should throw error if directory does not exist', () => {
        const {err} = DirOp.listDirectoryFolders(MOCK_FS, '/noSuchDir', false);

        chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
      });
    });

    describe('listDirectory', () => {
      it('should list directory files and folders', () => {
        const actualListing = listDirectoryArray(MOCK_FS, PRIMARY_FOLDER_PATH, false);
        const expectedFileNames = PRIMARY_FOLDER_FILES;

        chai.expect(actualListing).to.deep.equal([...expectedFileNames, 'subfolder']);
      });

      it('should list directory files and folders in root', () => {
        const actualFileNames = listDirectoryArray(createFileSystem({
          '/': {},
          '/bar': {content: 'bar'},
          '/baz': {content: 'baz'},
          '/subDirectory': {},
          '/subDirectory/doNotInclude': {}
        }), '/', false);

        chai.expect(actualFileNames).to.deep.equal(['bar', 'baz', 'subDirectory']);
      });

      it('should append trailing / to folders if given argument', () => {
        const actualListing = listDirectoryArray(MOCK_FS, PRIMARY_FOLDER_PATH, true);
        const expectedFileNames = PRIMARY_FOLDER_FILES;

        chai.expect(actualListing).to.deep.equal([...expectedFileNames, 'subfolder/']);
      });

      it('should append trailing / to folders as default behaviour', () => {
        const actualListing = listDirectoryArray(MOCK_FS, PRIMARY_FOLDER_PATH);
        const expectedFileNames = PRIMARY_FOLDER_FILES;

        chai.expect(actualListing).to.deep.equal([...expectedFileNames, 'subfolder/']);
      });

      it('should not throw error in empty directory', () => {
        const actualListing = listDirectoryArray(MOCK_FS, PRIMARY_SUBFOLDER_PATH);

        chai.expect(actualListing).to.deep.equal([]);
      });

      it('should throw error if listing a file', () => {
        const {err} = DirOp.listDirectory(MOCK_FS, PRIMARY_FILE_PATH, false);

        chai.expect(err.type).to.equal(fsErrorType.FILE_EXISTS);
      });

      it('should throw error if directory does not exist', () => {
        const {err} = DirOp.listDirectory(MOCK_FS, '/noSuchDir', false);

        chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
      });
    });

    describe('deleteDirectory', () => {
      it('should delete entire system with /', () => {
        const {fs} = DirOp.deleteDirectory(MOCK_FS, '/', true, true);

        chai.expect(fs).to.equal(createFileSystem({}));
      });

      it('should throw error if deleting a file', () => {
        const {err} = DirOp.deleteDirectory(MOCK_FS, PRIMARY_FILE_PATH);

        chai.expect(err.type).to.equal(fsErrorType.FILE_EXISTS);
      });

      it('should delete non-empty folder if forced', () => {
        const {fs} = DirOp.deleteDirectory(MOCK_FS, SECONDARY_FOLDER_PATH, true);

        chai.expect(fs).to.equal(MOCK_FS_EXC_SECONDARY_FOLDER);
      });

      it('should throw error if deleting non-empty folder', () => {
        const {err} = DirOp.deleteDirectory(MOCK_FS, SECONDARY_FOLDER_PATH);

        chai.expect(err.type).to.equal(fsErrorType.DIRECTORY_NOT_EMPTY);
      });

      it('should throw error if deleting non-existent folder', () => {
        const {err} = DirOp.deleteDirectory(MOCK_FS, '/noSuchFolder');

        chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
      });
    });

    describe('copyDirectory', () => {
      const SOURCE_MOCK_FS = createFileSystem({
        '/': {},
        '/1': {
          content: 'root file (1)'
        },
        '/home': {},
        '/home/1': {
          content: 'home file (1)'
        },
        '/emptyDirectory': {}
      });

      it('should copy from root to existing empty directory', () => {
        const {fs} = DirOp.copyDirectory(SOURCE_MOCK_FS, '/', '/emptyDirectory');

        chai.expect(fs).to.equal(createFileSystem({
          ...SOURCE_MOCK_FS.toJS(),
          '/emptyDirectory': {},
          '/emptyDirectory/emptyDirectory': {},
          '/emptyDirectory/1': {
            content: 'root file (1)'
          },
          '/emptyDirectory/home': {},
          '/emptyDirectory/home/1': {
            content: 'home file (1)'
          }
        }));
      });

      it('should copy directory from nested folder', () => {
        const {fs} = DirOp.copyDirectory(SOURCE_MOCK_FS, '/home', '/emptyDirectory');

        chai.expect(fs).to.equal(createFileSystem({
          ...SOURCE_MOCK_FS.toJS(),
          '/emptyDirectory/1': {
            content: 'home file (1)'
          }
        }));
      });

      it('should not overwrite files if not specified', () => {
        const fs = createFileSystem({
          '/srcFolder/child': {content: 'source file'},
          '/destFolder/child': {content: 'dest file'}
        });

        const {fs: newFS} = DirOp.copyDirectory(
          fs, '/srcFolder', '/destFolder', false
        );

        chai.expect(newFS).to.equal(fs);
      });

      it('should overwrite files if specified', () => {
        const fs = createFileSystem({
          '/srcFolder/child': {content: 'source file'},
          '/destFolder/child': {content: 'dest file'}
        });

        const {fs: newFS} = DirOp.copyDirectory(
          fs, '/srcFolder', '/destFolder', true
        );

        chai.expect(newFS).to.equal(createFileSystem({
          '/srcFolder/child': {content: 'source file'},
          '/destFolder/child': {content: 'source file'}
        }));
      });

      it('should throw error if replacing a folder with a file while copying', () => {
        const fs = createFileSystem({
          '/srcFolder/child': {content: 'home file (1)'},
          '/destFolder/child': {}
        });

        const {err} = DirOp.copyDirectory(fs, '/srcFolder', '/destFolder');

        chai.expect(err.type).to.equal(fsErrorType.OTHER);
      });

      it('should throw error if replacing a file with a folder while copying', () => {
        const fs = createFileSystem({
          '/srcFolder/child': {},
          '/destFolder/child': {content: 'home file (1)'}
        });

        const {err} = DirOp.copyDirectory(fs, '/srcFolder', '/destFolder');

        chai.expect(err.type).to.equal(fsErrorType.OTHER);
      });

      it('should throw error if copying directory to a file directly', () => {
        const {err} = DirOp.copyDirectory(SOURCE_MOCK_FS, '/home', '/1');

        chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
      });

      it('should throw error if copying file to a directory directly', () => {
        const {err} = DirOp.copyDirectory(SOURCE_MOCK_FS, '/1', '/home');

        chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
      });
    });
  });
});
