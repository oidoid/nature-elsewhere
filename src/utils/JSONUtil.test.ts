import {JSONObject, JSONUtil} from './JSONUtil'

type Test = [string, readonly JSONObject[], JSONObject]
const tests: readonly Test[] = [
  ['none', [], {}],
  ['empty none', [{}], {}],
  ['empty empty', [{}, {}], {}],
  ['empty empty empty', [{}, {}, {}], {}],

  ['nonempty empty', [{a: 1}, {}], {a: 1}],
  ['empty nonempty', [{}, {a: 1}], {a: 1}],
  ['nonempty nonempty', [{a: 1}, {b: 2}], {a: 1, b: 2}],
  ['nonempty nonempty nonempty', [{a: 1}, {b: 2}, {c: 3}], {a: 1, b: 2, c: 3}],

  ['conflict primitive', [{a: 1}, {a: 2}], {a: 2}],
  ['conflict array', [{a: [1]}, {a: [2]}], {a: [1, 2]}],
  ['conflict object', [{a: {b: 1}}, {a: {c: 2}}], {a: {b: 1, c: 2}}]
]

describe('merge()', () =>
  test.each(tests)('%#) %s (%p) => %p', (_msg, input, expected) =>
    expect(JSONUtil.merge(...input)).toStrictEqual(expected)
  ))
