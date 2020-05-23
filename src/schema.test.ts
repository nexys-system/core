import * as S from './schema';

test('id', () => {
  const r = S.id.validate({id: "34"})
  expect(r.value).toEqual({id: 34})
  expect(typeof r.error).toEqual('undefined')
})

test('uuid', () => {
  const uuid = 'f6603551-0a9e-11e9-941b-fa163e41f33d'
  const r = S.uuid.validate({uuid})
  expect(r.value).toEqual({uuid})
  expect(typeof r.error).toEqual('undefined')
})

test('name', () => {
  const r = S.name.validate({name: 'myname'})
  expect(r.value).toEqual({name: 'myname'})
  expect(typeof r.error).toEqual('undefined')
})