import chai from 'chai';
import { Map } from 'immutable';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import * as FileSystem from 'emulator-state/file-system';

describe('file-system', () => {
  describe('create', () => {
    it('should create an immutable map', () => {
      const fs = FileSystem.create({});

      chai.expect(fs).to.be.instanceOf(Map);
    });

    it('should create an immutable map from a JS object', () => {
      const fs = FileSystem.create({
        '/dir': {}
      });

      chai.expect(fs.get('/dir').toJS()).to.deep.equal({});
    });

    it('should add implied directory in nested file system', () => {
      const fs = FileSystem.create({
        '/a/b/c': { // implies /a, /a/b and a/b/c are all directories in the file system

        }
      });

      chai.expect(fs.get('/a').toJS()).to.deep.equal({});

      chai.expect(fs.get('/a/b').toJS()).to.deep.equal({});

      chai.expect(fs.get('/a/b/c').toJS()).to.deep.equal({});
    });
  });
});
