import chai from 'chai';
import { List, Record } from 'immutable';
import chaiImmutable from 'chai-immutable';
chai.use(chaiImmutable);

import * as Outputs from 'emulator-state/outputs';
import { OutputRecord } from 'emulator-output/output-factory';

describe('outputs', () => {
  describe('create', () => {
    it('should create an immutable list', () => {
      const outputs = Outputs.create([]);

      chai.expect(outputs).to.be.instanceOf(List);
    });
  });

  describe('addRecord', () => {
    const emptyOutputs = Outputs.create([]);

    it('should add an output record', () => {
      const newRecord = new OutputRecord({
        type: 'the type',
        content: ['the content']
      });

      const outputs = Outputs.addRecord(emptyOutputs, newRecord);

      chai.expect(outputs).to.equal(new List([newRecord]));
    });

    it('should throw error if adding plain JS object', () => {
      chai.expect(() =>
        Outputs.addRecord(emptyOutputs, {
          type: 'the type',
          content: ['the content']
        })
      ).to.throw();
    });

    it('should throw error if adding record without type', () => {
      const CustomRecord = new Record('a');
      const missingTypeRecord = new CustomRecord({
        content: 'content'
      });

      chai.expect(() =>
        Outputs.addRecord(emptyOutputs, missingTypeRecord)
      ).to.throw();
    });

    it('should throw error if adding record without content', () => {
      const CustomRecord = new Record('a');
      const missingContentRecord = new CustomRecord({
        type: 'type'
      });

      chai.expect(() =>
        Outputs.addRecord(emptyOutputs, missingContentRecord)
      ).to.throw();
    });
  });
});
