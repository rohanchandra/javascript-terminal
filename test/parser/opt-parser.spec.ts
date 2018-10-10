import chai from 'chai';

import parseOptions from '../../src/parser/option-parser';

// NB: Only rudimentary unit tests as `option-parser` is a wrapper for the
// `get-options` library

describe('option-parser', () => {
  it('should parse options', () => {
    const parsedOpts = parseOptions(['-b', 'fooVal', 'barVal', '--alias'], {
      '-a, --alias': '',
      '-b': '<foo> <bar>'
    });

    chai.expect(parsedOpts).to.deep.equal({
      options: {
        b: ['fooVal', 'barVal'],
        alias: true
      },
      argv: []
    });
  });

  it('should parse options argv', () => {
    const parsedOpts = parseOptions(['the argv', '--alias'], {
      '-a, --alias': ''
    });

    chai.expect(parsedOpts).to.deep.equal({
      options: {
        alias: true
      },
      argv: ['the argv']
    });
  });
});
