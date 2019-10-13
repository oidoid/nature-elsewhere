import {XY} from './XY'

describe('trunc()', () => {
  test('FloatXY', () =>
    expect(XY.trunc({x: 1.1, y: 22.2})).toStrictEqual(new XY(1, 22)))
  test('number', () => expect(XY.trunc(1.1, 22.2)).toStrictEqual(new XY(1, 22)))
})

test('diagonal()', () => expect(XY.diagonal(1)).toStrictEqual(new XY(1, 1)))

describe('constructor', () => {
  test('valid', () => expect(new XY(0, 0)).toBeTruthy())
  test('invalid x', () => expect(() => new XY(0.1, 0)).toThrow())
  test('invalid y', () => expect(() => new XY(0, 0.1)).toThrow())
})

describe('set x', () => {
  test('valid', () => expect((new XY(0, 0).x = 1)).toStrictEqual(1))
  test('invalid', () => expect(() => (new XY(0, 0).x = 0.1)).toThrow())
})

describe('set y', () => {
  test('valid', () => expect((new XY(0, 0).y = 1)).toStrictEqual(1))
  test('invalid', () => expect(() => (new XY(0, 0).y = 0.1)).toThrow())
})

test('toFloatXY()', () =>
  expect(new XY(1, 20).toFloatXY()).toStrictEqual({x: 1, y: 20}))
