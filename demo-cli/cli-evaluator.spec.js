import chai from 'chai';
const getTerminalEvaluator = require('./cli-evaluator');

chai.expect();

let evaluator = getTerminalEvaluator();

describe('cli-evaluator', () => {
  it('should evaluate command without string output', () => {
    const output = evaluator('mkdir a');

    chai.expect(output).to.equal('');
  });

  it('should evaluate command with string output', () => {
    const output = evaluator('echo hello world');

    chai.expect(output).to.equal('hello world');
  });

  it('should evaluate multiple commands', () => {
    evaluator('mkdir testFolder');
    evaluator('cd testFolder');
    evaluator('mkdir foo');
    evaluator('mkdir baz');
    evaluator('mkdir bar');
    evaluator('rmdir bar');
    const output = evaluator('ls');

    chai.expect(output).to.equal('baz/\nfoo/');
  });
});
