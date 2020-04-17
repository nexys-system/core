import * as J from './jwt';

test('encode', () => {
  const e = {a: 'a', b: 'a'};
  const s = J.sign(e);
  const o = J.verify(s);

  delete(o.iat)

  expect(e).toEqual(o)
})