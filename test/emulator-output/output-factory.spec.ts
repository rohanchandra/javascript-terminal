import chai from 'chai';

import {
  makeErrorOutput,
  makeHeaderOutput,
  makeTextOutput,
  OutputRecord
} from '../../src/emulator-output/output-factory';
import * as Types from '../../src/emulator-output/output-type';
import {fsErrorType} from "../../src/fs/fs-error";

describe('output-factory', () => {
  describe('OutputRecord', () => {
    it('should create a record with type and content', () => {
      const newRecord = new OutputRecord({
        content: ['the content'],
        type: 'the type'
      });

      chai.expect(newRecord.type).to.equal('the type');
      chai.expect(newRecord.content).to.be.deep.equal(['the content']);
    });

    it('should ignore keys not in the schema', () => {
      const newRecord = new OutputRecord({
        notInSchema: 'do not add me'
      });

      chai.expect(newRecord.notInSchema).to.equal(undefined);
    });
  });

  describe('makeHeaderOutput', () => {
    it('should create a record with the cwd', () => {
      const outputRecord = makeHeaderOutput('the cwd', 'the command');

      chai
        .expect(outputRecord.content)
        .to.deep.equal({ cwd: 'the cwd', command: 'the command' });
    });

    it('should create a record with header type', () => {
      const outputRecord = makeHeaderOutput('');

      chai.expect(outputRecord.type).to.equal(Types.HEADER_OUTPUT_TYPE);
    });
  });

  describe('makeTextOutput', () => {
    it('should create a record with content', () => {
      const textRecord = makeTextOutput('the content');

      chai.expect(textRecord.content).to.be.deep.equal('the content');
    });

    it('should create a record with text type', () => {
      const textRecord = makeTextOutput('');

      chai.expect(textRecord.type).to.equal(Types.TEXT_OUTPUT_TYPE);
    });
  });

  describe('makeTextOutput', () => {
    it('should combine source of error and type of error in output', () => {
      const errorRecord = makeErrorOutput({
        message: 'Other',
        source: 'fs',
        type: fsErrorType.OTHER
      });

      chai.expect(errorRecord.content).to.be.deep.equal('fs: Other');
    });

    it('should create a record with error type', () => {


      const errorRecord = makeErrorOutput({
        message: 'Error',
        source: 'fs',
        type: fsErrorType.OTHER
      });

      chai.expect(errorRecord.type).to.equal(Types.TEXT_ERROR_OUTPUT_TYPE);
    });
  });
});
