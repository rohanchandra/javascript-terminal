import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

chai.use((_chai, utils) => {
  const { Assertion } = _chai;

  Assertion.addMethod('toEqualState', function(value: any) {
    // @ts-ignore
    const obj = this._obj;

    new Assertion(obj.getImmutable()).to.equal(value.getImmutable());
  });
}) ;

export default chai;
