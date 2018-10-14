import { fromJS } from 'immutable';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import * as FileUtil from 'fs/util/file-util';

describe('file-util', () => {
  describe('isFile', () => {
    it('should exist', () => {
      chai.assert.isFunction(FileUtil.isFile);
    });

    it('should handle directory object', () => {
      const dir = fromJS({});

      chai.expect(FileUtil.isFile(dir)).to.equal(false);
    });

    it('should handle directory with metadata', () => {
      const dir = fromJS({
        metadataKey: 'abc'
      });

      chai.expect(FileUtil.isFile(dir)).to.equal(false);
    });

    it('should handle file object with non-empty content', () => {
      const nonEmptyFileObject = fromJS({
        content: 'file content'
      });

      chai.expect(FileUtil.isFile(nonEmptyFileObject)).to.equal(true);
    });

    it('should handle file object with empty content', () => {
      const emptyFileObject = fromJS({
        content: ''
      });

      chai.expect(FileUtil.isFile(emptyFileObject)).to.equal(true);
    });
  });

  describe('isDirectory', () => {
    it('should exist', () => {
      chai.assert.isFunction(FileUtil.isDirectory);
    });

    it('should handle directory object', () => {
      const dir = fromJS({});

      chai.expect(FileUtil.isDirectory(dir)).to.equal(true);
    });

    it('should handle directory with metadata', () => {
      const dir = fromJS({
        metadataKey: 'abc'
      });

      chai.expect(FileUtil.isDirectory(dir)).to.equal(true);
    });

    it('should handle file object with empty content', () => {
      const emptyFileObject = fromJS({
        content: ''
      });

      chai.expect(FileUtil.isDirectory(emptyFileObject)).to.equal(false);
    });
  });

  describe('makeFile', () => {
    it('should exist', () => {
      chai.assert.isFunction(FileUtil.makeFile);
    });

    it('should make empty file', () => {
      const file = FileUtil.makeFile();
      const expectedFile = fromJS({
        content: ''
      });

      chai.expect(file).to.equal(expectedFile);
    });

    it('should make non-empty file', () => {
      const file = FileUtil.makeFile('hello world');
      const expectedFile = fromJS({
        content: 'hello world'
      });

      chai.expect(file).to.equal(expectedFile);
    });

    it('should make file without metadata', () => {
      const file = FileUtil.makeFile('hello world', {});
      const expectedFile = fromJS({
        content: 'hello world'
      });

      chai.expect(file).to.equal(expectedFile);
    });

    it('should make file with metadata', () => {
      const file = FileUtil.makeFile('hello world', {
        metadataKey: 'meta value',
        permission: 666
      });
      const expectedFile = fromJS({
        content: 'hello world',
        metadataKey: 'meta value',
        permission: 666
      });

      chai.expect(file).to.equal(expectedFile);
    });
  });

  describe('makeDirectory', () => {
    it('should exist', () => {
      chai.assert.isFunction(FileUtil.makeDirectory);
    });

    it('should make empty directory', () => {
      const directory = FileUtil.makeDirectory();
      const expectedDirectory = fromJS({});

      chai.expect(directory).to.equal(expectedDirectory);
    });

    it('should make directory with metadata', () => {
      const directory = FileUtil.makeDirectory({
        metadataKey: 'meta value',
        permission: 666
      });

      const expectedDirectory = fromJS({
        metadataKey: 'meta value',
        permission: 666
      });

      chai.expect(directory).to.equal(expectedDirectory);
    });
  });
});
