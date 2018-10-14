import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import * as FileOp from 'fs/operations/file-operations';
import * as FileUtil from 'fs/util/file-util';
import { fsErrorType } from 'fs/fs-error';
import { create as createFileSystem } from 'emulator-state/file-system';

describe('file-operations', () => {
  // empty file
  const EMPTY_FILE_PATH = '/files/empty.txt';
  const EMPTY_FILE_CONTENT = '';

  // non-empty file
  const NON_EMPTY_FILENAME = 'non_empty.txt';
  const NON_EMPTY_FILE_PATH = `/files/${NON_EMPTY_FILENAME}`;
  const NON_EMPTY_FILE_CONTENT = 'hello world!  ';

  // nested file
  const NESTED_FILE_PATH = '/files/deeply/nested/nested.txt';
  const NESTED_FILE_CONTENT = 'this is a deeply nested file';

  // empty folder
  const EMPTY_DIRECTORY = '/empty';

  const fileFS = createFileSystem({
    [EMPTY_FILE_PATH]: {content: EMPTY_FILE_CONTENT},
    [NON_EMPTY_FILE_PATH]: {content: NON_EMPTY_FILE_CONTENT},
    [NESTED_FILE_PATH]: {content: NESTED_FILE_CONTENT},
    [EMPTY_DIRECTORY]: {}
  });

  describe('hasFile', () => {
    it('should return true if file is present', () => {
      chai.expect(
        FileOp.hasFile(fileFS, NON_EMPTY_FILE_PATH)
      ).to.equal(true);
    });

    it('should return false if file is not present in existent directory', () => {
      chai.expect(FileOp.hasFile(fileFS, '/noSuchFile')).to.equal(false);
    });

    it('should return false if given non-existent directory', () => {
      chai.expect(FileOp.hasFile(fileFS, '/noSuchDirectory/noSuchFile.txt')).to.equal(false);
    });
  });

  describe('readFile', () => {
    it('should read non-empty file', () => {
      const {file} = FileOp.readFile(fileFS, NON_EMPTY_FILE_PATH);

      chai.expect(file.get('content')).to.equal(NON_EMPTY_FILE_CONTENT);
    });

    it('should read empty file', () => {
      const {file} = FileOp.readFile(fileFS, EMPTY_FILE_PATH);

      chai.expect(file.get('content')).to.equal(EMPTY_FILE_CONTENT);
    });

    it('should read file in nested directory', () => {
      const {file} = FileOp.readFile(fileFS, NESTED_FILE_PATH);

      chai.expect(file.get('content')).to.equal(NESTED_FILE_CONTENT);
    });

    it('should throw error if trying to read a directory', () => {
      const {err} = FileOp.readFile(fileFS, EMPTY_DIRECTORY);

      chai.expect(err.type).to.equal(fsErrorType.IS_A_DIRECTORY);
    });

    it('should throw error if directory does not exist', () => {
      const {err} = FileOp.readFile(fileFS, '/noSuchDirectory/fileName');

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_FILE);
    });

    it('should throw error if empty directory argument', () => {
      const {err} = FileOp.readFile(fileFS, '');

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_FILE);
    });

    it('should throw error if file does not exist', () => {
      const {err} = FileOp.readFile(fileFS, '/noSuchFile.txt');

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_FILE);
    });
  });

  describe('writeFile', () => {
    const getContentAfterFileWrite = (fs, filePath, ...otherWriteFSArgs) => {
      const {fs: fsAfterWrite} = FileOp.writeFile(fs, filePath, ...otherWriteFSArgs);
      const {file} = FileOp.readFile(fsAfterWrite, filePath);

      return file.get('content');
    };

    it('should write new empty file', () => {
      const emptyFile = FileUtil.makeFile('');

      chai.expect(
        getContentAfterFileWrite(fileFS, '/files/newFile.txt', emptyFile)
      ).to.equal('');
    });

    it('should throw error if trying to write to a file path', () => {
      const {err} = FileOp.writeFile(
        fileFS, `${EMPTY_FILE_PATH}/newFile`, FileUtil.makeFile()
      );

      chai.expect(err.type).to.equal(fsErrorType.NOT_A_DIRECTORY);
    });

    it('should throw error if overwriting file', () => {
      const {err} = FileOp.writeFile(fileFS, NON_EMPTY_FILE_PATH, FileUtil.makeFile());

      chai.expect(err.type).to.equal(fsErrorType.FILE_OR_DIRECTORY_EXISTS);
    });

    it('should throw error if directory does not exist', () => {
      const {err} = FileOp.writeFile(
        fileFS, '/noSuchDirectory/fileName', FileUtil.makeFile()
      );

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
    });
  });

  describe('copyFile', () => {
    it('should copy file into empty directory with specified file name', () => {
      const newFilePath = `${EMPTY_DIRECTORY}/newFile`;
      const {fs} = FileOp.copyFile(fileFS, NON_EMPTY_FILE_PATH, newFilePath);
      const {file} = FileOp.readFile(fs, newFilePath);

      chai.expect(file.get('content')).to.equal(NON_EMPTY_FILE_CONTENT);
    });

    it('should copy file into root directory with same file name as source', () => {
      const {fs} = FileOp.copyFile(fileFS, NON_EMPTY_FILE_PATH, '/');
      const {file} = FileOp.readFile(fs, `/${NON_EMPTY_FILENAME}`);

      chai.expect(file.get('content')).to.equal(NON_EMPTY_FILE_CONTENT);
    });

    it('should copy file into empty directory with same file name as source', () => {
      const {fs} = FileOp.copyFile(fileFS, NON_EMPTY_FILE_PATH, EMPTY_DIRECTORY);
      const {file} = FileOp.readFile(fs, `${EMPTY_DIRECTORY}/${NON_EMPTY_FILENAME}`);

      chai.expect(file.get('content')).to.equal(NON_EMPTY_FILE_CONTENT);
    });

    it('should overwrite file', () => {
      const {fs} = FileOp.copyFile(fileFS, NON_EMPTY_FILE_PATH, EMPTY_FILE_PATH);
      const {file} = FileOp.readFile(fs, EMPTY_FILE_PATH);

      chai.expect(file.get('content')).to.equal(NON_EMPTY_FILE_CONTENT);
    });

    it('should throw error if copying FROM non-existent path', () => {
      const {err} = FileOp.copyFile(
        fileFS, '/noSuchDirectory/fileName', NESTED_FILE_PATH
      );

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_FILE);
    });

    it('should throw error if copying TO non-existent path with a filename', () => {
      const {err} = FileOp.copyFile(
        fileFS, NESTED_FILE_PATH, '/noSuchDirectory/fileName'
      );

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_DIRECTORY);
    });
  });

  describe('deleteFile', () => {
    it('should delete file', () => {
      const {fs: newFS} = FileOp.deleteFile(fileFS, NESTED_FILE_PATH);

      chai.expect(FileOp.hasFile(newFS, NESTED_FILE_PATH)).to.equal(false);
    });

    it('should throw error if trying to delete a directory', () => {
      const {err} = FileOp.deleteFile(fileFS, EMPTY_DIRECTORY);

      chai.expect(err.type).to.equal(fsErrorType.IS_A_DIRECTORY);
    });

    it('should throw error if deleting from non-existent directory', () => {
      const {err} = FileOp.deleteFile(fileFS, '/noSuchDirectory/fileName');

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_FILE);
    });

    it('should throw error if deleting from non-existent file', () => {
      const {err} = FileOp.deleteFile(fileFS, '/files/noSuchFile');

      chai.expect(err.type).to.equal(fsErrorType.NO_SUCH_FILE);
    });
  });
});
