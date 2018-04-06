import chai from 'chai';

import * as PathUtil from 'fs/util/path-util';

describe('path-util', () => {
  describe('isTrailingPath', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.isTrailingPath);
    });

    it('should return false for root', () => {
      chai.expect(PathUtil.isTrailingPath('/')).to.equal(false);
    });

    it('should return false for path with trailing /', () => {
      chai.expect(PathUtil.isTrailingPath('/a')).to.equal(false);
    });

    it('should return true for trailing path', () => {
      chai.expect(PathUtil.isTrailingPath('/a/b/')).to.equal(true);
    });
  });

  describe('toPathParts', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.toPathParts);
    });

    it('should split absolute path into path parts with root', () => {
      chai.expect(
        PathUtil.toPathParts('/a/b/c')
      ).to.deep.equal(['/', 'a', 'b', 'c']);
    });

    it('should ignore trailing /', () => {
      chai.expect(
        PathUtil.toPathParts('/a/b/c/')
      ).to.deep.equal(['/', 'a', 'b', 'c']);
    });

    it('should split relative path with .. into path parts', () => {
      chai.expect(
        PathUtil.toPathParts('../d/e')
      ).to.deep.equal(['..', 'd', 'e']);
    });

    it('should split single .. into single path part', () => {
      chai.expect(
        PathUtil.toPathParts('..')
      ).to.deep.equal(['..']);
    });

    it('should split relative path with . into path parts', () => {
      chai.expect(
        PathUtil.toPathParts('./a/b/c')
      ).to.deep.equal(['.', 'a', 'b', 'c']);
    });

    it('should split nested relative path into path parts', () => {
      chai.expect(
        PathUtil.toPathParts('a/b/c')
      ).to.deep.equal(['a', 'b', 'c']);
    });

    it('should split single relative path into single path part', () => {
      chai.expect(
        PathUtil.toPathParts('a')
      ).to.deep.equal(['a']);
    });

    it('should split single . into single path part', () => {
      chai.expect(
        PathUtil.toPathParts('.')
      ).to.deep.equal(['.']);
    });

    it('should split mixed .. and . in relative path', () => {
      chai.expect(
        PathUtil.toPathParts('./../././a/../s')
      ).to.deep.equal(['.', '..', '.', '.', 'a', '..', 's']);
    });

    it('should split mixed .. and . in absolute path', () => {
      chai.expect(
        PathUtil.toPathParts('/./../end')
      ).to.deep.equal(['/', '.', '..', 'end']);
    });

    it('should split root into single path part', () => {
      chai.expect(
        PathUtil.toPathParts('/')
      ).to.deep.equal(['/']);
    });
  });

  describe('toPath', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.toPath);
    });

    it('should join path parts with root', () => {
      chai.expect(
        PathUtil.toPath(['/', 'a', 'b', 'c'])
      ).to.deep.equal('/a/b/c');
    });

    it('should join relative path with ..', () => {
      chai.expect(
        PathUtil.toPath(['..', 'd', 'e'])
      ).to.deep.equal('../d/e');
    });

    it('should join single ..', () => {
      chai.expect(
        PathUtil.toPath(['..'])
      ).to.deep.equal('..');
    });

    it('should join relative path .', () => {
      chai.expect(
        PathUtil.toPath(['.', 'a', 'b', 'c'])
      ).to.deep.equal('./a/b/c');
    });

    it('should join nested relative path', () => {
      chai.expect(
        PathUtil.toPath(['a', 'b', 'c'])
      ).to.deep.equal('a/b/c');
    });

    it('should join single relative path', () => {
      chai.expect(
        PathUtil.toPath(['a'])
      ).to.deep.equal('a');
    });

    it('should join single .', () => {
      chai.expect(
        PathUtil.toPath(['.'])
      ).to.deep.equal('.');
    });

    it('should join mixed .. and . in relative path', () => {
      chai.expect(
        PathUtil.toPath(['.', '..', '.', '1', '..', '2'])
      ).to.deep.equal('./.././1/../2');
    });

    it('should join mixed .. and . in absolute path', () => {
      chai.expect(
        PathUtil.toPath(['/', '.', '..', 'end'])
      ).to.deep.equal('/./../end');
    });

    it('should join root', () => {
      chai.expect(
        PathUtil.toPath(['/'])
      ).to.deep.equal('/');
    });
  });

  describe('getPathBreadCrumbs', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.getPathBreadCrumbs);
    });

    it('should find breadcrumb paths from three levels of directories', () => {
      chai.expect(
        PathUtil.getPathBreadCrumbs('/a/b/c')
      ).to.deep.equal(['/', '/a', '/a/b', '/a/b/c']);
    });

    it('should find breadcrumb paths from two levels of directories', () => {
      chai.expect(
        PathUtil.getPathBreadCrumbs('/a/b')
      ).to.deep.equal(['/', '/a', '/a/b']);
    });

    it('should find breadcrumb paths from one directory level', () => {
      chai.expect(
        PathUtil.getPathBreadCrumbs('/a')
      ).to.deep.equal(['/', '/a']);
    });

    it('should find breadcrumb paths from root', () => {
      chai.expect(
        PathUtil.getPathBreadCrumbs('/')
      ).to.deep.equal(['/']);
    });
  });

  describe('getLastPathPart', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.getLastPathPart);
    });

    it('should extract file name from root path', () => {
      chai.expect(
        PathUtil.getLastPathPart('/abc.txt')
      ).to.equal('abc.txt');
    });

    it('should extract file name from absolute path', () => {
      chai.expect(
        PathUtil.getLastPathPart('/a/b/a.txt')
      ).to.equal('a.txt');
    });

    it('should extract file name from relative path', () => {
      chai.expect(
        PathUtil.getLastPathPart('../a.txt')
      ).to.equal('a.txt');
    });
  });

  describe('getPathParent', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.getPathParent);
    });

    it('should have parent of root being itself', () => {
      chai.expect(
        PathUtil.getPathParent('/')
      ).to.equal('/');
    });

    it('should remove file name from root directory path', () => {
      chai.expect(
        PathUtil.getPathParent('/README')
      ).to.equal('/');
    });

    it('should remove file name from absolute path', () => {
      chai.expect(
        PathUtil.getPathParent('/a/b/c/d/foo/foo.txt')
      ).to.equal('/a/b/c/d/foo');
    });

    it('should remove file name from relative path', () => {
      chai.expect(
        PathUtil.getPathParent('../a/b/c/d/foo/foo.txt')
      ).to.equal('../a/b/c/d/foo');
    });

    it('should remove file name from path, if file has no extension', () => {
      chai.expect(
        PathUtil.getPathParent('a/b/c/d/foo/README')
      ).to.equal('a/b/c/d/foo');
    });
  });

  describe('splitFilePath', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.splitFilePath);
    });

    it('should split file path with root directory (/)', () => {
      chai.expect(
        PathUtil.splitFilePath('/README')
      ).to.deep.equal({
        dirPath: '/',
        fileName: 'README'
      });
    });

    it('should absolute split file path into directory and file name', () => {
      chai.expect(
        PathUtil.splitFilePath('/a/b/c/d/foo/foo.txt')
      ).to.deep.equal({
        dirPath: '/a/b/c/d/foo',
        fileName: 'foo.txt'
      });
    });

    it('should split relative into directory and file name', () => {
      chai.expect(
        PathUtil.splitFilePath('../a/b/c/d/foo/foo.txt')
      ).to.deep.equal({
        dirPath: '../a/b/c/d/foo',
        fileName: 'foo.txt'
      });
    });
  });

  describe('isAbsPath', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.isAbsPath);
    });

    it('should mark root as absolute path', () => {
      chai.expect(PathUtil.isAbsPath('/')).to.equal(true);
    });

    it('should mark nested absolute path as absolute path', () => {
      chai.expect(PathUtil.isAbsPath('/a/b/c/d')).to.equal(true);
    });

    it('should not mark relative path as absolute path', () => {
      chai.expect(PathUtil.isAbsPath('../a/b/c/d')).to.equal(false);
    });
  });

  describe('removeTrailingSeparator', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.removeTrailingSeparator);
    });

    it('should not remove root /', () => {
      chai.expect(
        PathUtil.removeTrailingSeparator('/')
      ).to.equal('/');
    });

    it('should not / from path without trailing separator', () => {
      chai.expect(
        PathUtil.removeTrailingSeparator('/a/b/c')
      ).to.equal('/a/b/c');
    });

    it('should remove last /', () => {
      chai.expect(
        PathUtil.removeTrailingSeparator('/root/a/b/')
      ).to.equal('/root/a/b');
    });
  });

  describe('toAbsolutePath', () => {
    it('should exist', () => {
      chai.assert.isFunction(PathUtil.toAbsolutePath);
    });

    it('should ignore absolute paths', () => {
      chai.expect(
        PathUtil.toAbsolutePath('/a/b/c', '/a/b')
      ).to.equal('/a/b/c');

      chai.expect(
        PathUtil.toAbsolutePath('/', '/a/b')
      ).to.equal('/');
    });

    describe('use of . (current directory)', () => {
      it('should not modify . if is part of the file name (a hidden file)', () => {
        chai.expect(
          PathUtil.toAbsolutePath('a/.hidden-file', '/base')
        ).to.equal('/base/a/.hidden-file');
      });

      it('should append directory to current directory', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./new_folder', '/base/old_folder')
        ).to.equal('/base/old_folder/new_folder');
      });

      it('should append directory to root directory', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./new_folder', '/')
        ).to.equal('/new_folder');
      });

      it('should resolve ./ to /', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./', '/')
        ).to.equal('/');
      });

      it('should ignore trailing . when going to new directory', () => {
        chai.expect(
          PathUtil.toAbsolutePath('subfolder/.', '/base/folder')
        ).to.equal('/base/folder/subfolder');
      });

      it('should ignore multiple usage of .', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./././.', '/base/folder')
        ).to.equal('/base/folder');
      });
    });

    describe('use of .. (parent directory)', () => {
      it('should go up one level', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../new_folder', '/base/old_folder')
        ).to.equal('/base/new_folder');
      });

      it('should not change path if .. is at the end of a path', () => {
        chai.expect(
          PathUtil.toAbsolutePath('into_new_folder/..', '/base/old_folder')
        ).to.equal('/base/old_folder');
      });

      it('should go up one level if .. is in the middle of a path', () => {
        chai.expect(
          PathUtil.toAbsolutePath('into_new_folder/../a', '/base/old_folder')
        ).to.equal('/base/old_folder/a');
      });

      it('should go up one level in deeply nested folder', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../new_folder', '/root/a/b/c/d')
        ).to.equal('/root/a/b/c/new_folder');
      });

      it('should go up two levels', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../../new_folder', '/base/old_folder')
        ).to.equal('/new_folder');
      });

      it('should go up two levels in deeply nested folder', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../../new_folder', '/root/a/b/c/d')
        ).to.equal('/root/a/b/new_folder');
      });

      it('should stop going up directories once at root', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../../../', '/base')
        ).to.equal('/');

        chai.expect(
          PathUtil.toAbsolutePath('../..', '/base')
        ).to.equal('/');

        chai.expect(
          PathUtil.toAbsolutePath('../../', '/base')
        ).to.equal('/');

        chai.expect(
          PathUtil.toAbsolutePath('..', '/')
        ).to.equal('/');
      });
    });

    describe('use of . and .. together', () => {
      it('should go to parent with ../. and folder name', () => {
        chai.expect(
          PathUtil.toAbsolutePath('.././abc', '/base/folder')
        ).to.equal('/base/abc');
      });

      it('should go to parent with ./.. and folder name', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./../a', '/')
        ).to.equal('/a');
      });

      it('should go to parent with ./.. and folder name at root', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./../a', '/')
        ).to.equal('/a');
      });

      it('should go up with ../. and folder name at root', () => {
        chai.expect(
          PathUtil.toAbsolutePath('.././abc', '/')
        ).to.equal('/abc');
      });

      it('should go to parent with ./..', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./..', '/base/folder')
        ).to.equal('/base');
      });

      it('should go to parent with ../.', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../.', '/base/folder')
        ).to.equal('/base');
      });

      it('should go up directory twice with ./../..', () => {
        chai.expect(
          PathUtil.toAbsolutePath('./../..', '/base/folder')
        ).to.equal('/');
      });

      it('should go up with .. until at root, ignoring ., and add folder name', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../../.././a', '/base/folder')
        ).to.equal('/a');
      });
    });

    describe('mixed absolute and relative paths', () => {
      it('should go up with ..', () => {
        chai.expect(
          PathUtil.toAbsolutePath('/a/../b', '/')
        ).to.equal('/b');
      });

      it('should ignore current working directory', () => {
        chai.expect(
          PathUtil.toAbsolutePath('/a/../b', '/ignore/cwd')
        ).to.equal('/b');
      });

      it('should ignore .', () => {
        chai.expect(
          PathUtil.toAbsolutePath('/a/./b', '/')
        ).to.equal('/a/b');
      });
    });

    describe('file paths', () => {
      it('should resolve path with only file name and root', () => {
        chai.expect(
          PathUtil.toAbsolutePath('fileName', '/')
        ).to.equal('/fileName');
      });

      it('should resolve path with only file name and dir', () => {
        chai.expect(
          PathUtil.toAbsolutePath('fileName', '/subdir')
        ).to.equal('/subdir/fileName');
      });

      it('should resolve absolute path with file name', () => {
        chai.expect(
          PathUtil.toAbsolutePath('/a/fileName', '/')
        ).to.equal('/a/fileName');
      });

      it('should resolve relative path with file name', () => {
        chai.expect(
          PathUtil.toAbsolutePath('../a/fileName', '/b/c')
        ).to.equal('/b/a/fileName');
      });
    });
  });
});
