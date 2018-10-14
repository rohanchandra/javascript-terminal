import chai from 'chai';
import chaiImmutable from 'chai-immutable';
import { Map } from 'immutable';

chai.use(chaiImmutable);

import * as EnvironmentVariables from 'emulator-state/environment-variables';

describe('environment-variables', () => {
  const ENV_VARIABLES = EnvironmentVariables.create({
    'cwd': '/',
    'foo': 'bar'
  });

  describe('create', () => {
    it('should create an immutable map', () => {
      const envVariables = EnvironmentVariables.create({}, '/');

      chai.expect(envVariables).to.be.instanceOf(Map);
    });

    it('should create environment variables from JS object', () => {
      const envVariables = EnvironmentVariables.create({
        'a': 'b',
        'c': 'd',
        'cwd': '/'
      });

      chai.expect(envVariables).to.equal(Map({
        'a': 'b',
        'c': 'd',
        'cwd': '/'
      }));
    });

    it('should create environment variables if cwd is separately provided', () => {
      const envVariables = EnvironmentVariables.create({
        'a': 'b',
        'c': 'd'
      }, '/path/to/cwd');

      chai.expect(envVariables).to.equal(Map({
        'a': 'b',
        'c': 'd',
        'cwd': '/path/to/cwd'
      }));
    });

    it('should throw error if no cwd (current working directory) is set', () => {
      chai.expect(() =>
        EnvironmentVariables.create({}, null)
      ).to.throw();
    });
  });

  describe('getEnvironmentVariable', () => {
    it('should get value of environment variable', () => {
      chai.expect(
        EnvironmentVariables.getEnvironmentVariable(ENV_VARIABLES, 'foo')
      ).to.equal('bar');
    });

    it('should return undefined if variable does not exist', () => {
      chai.expect(
        EnvironmentVariables.getEnvironmentVariable(ENV_VARIABLES, 'noVar')
      ).to.equal(undefined);
    });
  });

  describe('setEnvironmentVariable', () => {
    it('should set new variable', () => {
      const newEnvVariables = EnvironmentVariables.setEnvironmentVariable(
        ENV_VARIABLES, 'new key', 'new value'
      );

      chai.expect(
        newEnvVariables.get('new key')
      ).to.equal('new value');
    });

    it('should overwrite existing variable', () => {
      const newEnvVariables = EnvironmentVariables.setEnvironmentVariable(
        ENV_VARIABLES, 'foo', 'new value');

      chai.expect(
        newEnvVariables.get('foo')
      ).to.equal('new value');
    });
  });

  describe('unsetEnvironmentVariable', () => {
    it('should remove existing variable', () => {
      const newEnvVariables = EnvironmentVariables.unsetEnvironmentVariable(
        ENV_VARIABLES, 'foo');

      chai.expect(
        newEnvVariables.get('foo')
      ).to.equal(undefined);
    });

    it('should have no effect if variable does not exist', () => {
      const newEnvVariables = EnvironmentVariables.unsetEnvironmentVariable(
        ENV_VARIABLES, 'noSuchKey'
      );

      chai.expect(
        newEnvVariables.get('noSuchKey')
      ).to.equal(undefined);
    });
  });
});
