import chai from 'chai';
import { Seq, fromJS } from 'immutable';

import * as GlobUtil from 'fs/util/glob-util';

describe('glob-util', () => {
  describe('glob', () => {
    it('should exist', () => {
      chai.assert.isFunction(GlobUtil.glob);
    });

    // * matches any character except /
    it('should match files/folders in directory with *', () => {
      chai.expect(GlobUtil.glob('/a/b/c', '/a/b/*')).to.equal(true);
      chai.expect(GlobUtil.glob('/a/b/c/d', '/a/b/*')).to.equal(false);
      chai.expect(GlobUtil.glob('/a/b', '/a/b/*')).to.equal(false);
    });

    it('should match incomplete file/folder names', () => {
      chai.expect(GlobUtil.glob('/a/bbb/c', '/a/b*/*')).to.equal(true);
      chai.expect(GlobUtil.glob('/a/bbb/c', '/a/b*/c')).to.equal(true);
    });

    // ** matches any character including /
    it('should match multiple subdirectory levels with **', () => {
      chai.expect(GlobUtil.glob('/a/b/c', '/a/b/**')).to.equal(true);
      chai.expect(GlobUtil.glob('/a/b/c/d', '/a/b/**')).to.equal(true);
      chai.expect(GlobUtil.glob('/a/b', '/a/b/**')).to.equal(false);
    });
  });

  describe('globSeq', () => {
    it('should exist', () => {
      chai.assert.isFunction(GlobUtil.globSeq);
    });

    it('should empty sequence', () => {
      const [...paths] = GlobUtil.globSeq(
        Seq([]),
        '/*'
      );

      chai.expect(paths).to.deep.equal([]);
    });

    it('should match sequence', () => {
      const [...paths] = GlobUtil.globSeq(
        Seq(['/', '/a', '/b']),
        '/*'
      );

      chai.expect(paths).to.deep.equal(['/a', '/b']);
    });
  });

  describe('globPaths', () => {
    const mockFS = fromJS({
      '/': {},
      '/a': {},
      '/a/foo': {},
      '/a/foo/bar': {}
    });

    it('should exist', () => {
      chai.assert.isFunction(GlobUtil.globPaths);
    });

    it('should match immediate children with * from root directory', () => {
      const [...paths] = GlobUtil.globPaths(mockFS, '/*');

      chai.expect(paths).to.deep.equal(['/a']);
    });

    it('should match immediate children with * from subfolder', () => {
      const [...paths] = GlobUtil.globPaths(mockFS, '/a/*');

      chai.expect(paths).to.deep.equal(['/a/foo']);
    });

    it('should match multiple levels with ** from subfolder', () => {
      const [...paths] = GlobUtil.globPaths(mockFS, '/a/**');

      chai.expect(paths).to.deep.equal(['/a/foo', '/a/foo/bar']);
    });

    it('should match hidden file', () => {
      const [...paths] = GlobUtil.globPaths(fromJS({
        '/.hidden': {}
      }), '/*');

      chai.expect(paths).to.deep.equal(['/.hidden']);
    });
  });

  describe('captureGlobPaths', () => {
    const mockFS = fromJS({
      '/': {},
      '/a': {},
      '/a/foo': {},
      '/a/foo/bar': {}
    });

    it('should exist', () => {
      chai.assert.isFunction(GlobUtil.captureGlobPaths);
    });

    it('should match immediate children names with * from root directory', () => {
      const [...paths] = GlobUtil.captureGlobPaths(mockFS, '/*');

      chai.expect(paths).to.deep.equal(['a']);
    });

    it('should match immediate children names with * from subfolder', () => {
      const [...paths] = GlobUtil.captureGlobPaths(mockFS, '/a/*');

      chai.expect(paths).to.deep.equal(['foo']);
    });

    it('should match multiple level names with ** from subfolder', () => {
      const [...paths] = GlobUtil.captureGlobPaths(mockFS, '/a/**');

      chai.expect(paths).to.deep.equal(['foo', 'foo/bar']);
    });

    it('should match hidden file', () => {
      const [...paths] = GlobUtil.captureGlobPaths(fromJS({
        '/.hidden': {}
      }), '/*');

      chai.expect(paths).to.deep.equal(['.hidden']);
    });
  });
});
