import {WH} from './WH'

test('trunc()', () => expect(WH.trunc(1.1, 22.2)).toStrictEqual(new WH(1, 22)))

test('square()', () => expect(WH.square(1)).toStrictEqual(new WH(1, 1)))

describe('constructor', () => {
  test('valid', () => expect(new WH(0, 0)).toBeTruthy())
  test('invalid w', () => expect(() => new WH(0.1, 0)).toThrow())
  test('invalid h', () => expect(() => new WH(0, 0.1)).toThrow())
})

describe('set w', () => {
  test('valid', () => expect((new WH(0, 0).w = 1)).toStrictEqual(1))
  test('invalid', () => expect(() => (new WH(0, 0).w = 0.1)).toThrow())
})

describe('set h', () => {
  test('valid', () => expect((new WH(0, 0).h = 1)).toStrictEqual(1))
  test('invalid', () => expect(() => (new WH(0, 0).h = 0.1)).toThrow())
})

test('copy()', () => expect(new WH(1, 20).copy()).toStrictEqual(new WH(1, 20)))

test.each<[Readonly<WH>, Readonly<WH>, boolean]>([
  // Unequal.
  [new WH(1, 20), new WH(300, 4000), false],
  [new WH(300, 4000), new WH(1, 20), false],

  // Equal.
  [new WH(1, 20), new WH(1, 20), true]
])('equal() %#) (%p, %p) => %p', (lhs, rhs, expected) =>
  expect(lhs.equal(rhs)).toStrictEqual(expected)
)

test('add()', () =>
  expect(new WH(1, 20).add(new WH(300, 4000))).toStrictEqual(new WH(301, 4020)))

test('sub()', () =>
  expect(new WH(1000, 200).sub(new WH(30, 4))).toStrictEqual(new WH(970, 196)))

test('mul()', () =>
  expect(new WH(10, 200).mul(new WH(3000, 40_000))).toStrictEqual(
    new WH(30_000, 8_000_000)
  ))

test('div()', () =>
  expect(new WH(1000, 200).div(new WH(10, 20))).toStrictEqual(new WH(100, 10)))

test.each([
  [new WH(1, 20), new WH(300, 4000), new WH(1, 20)],
  [new WH(100, 20), new WH(3, 4000), new WH(3, 20)],
  [new WH(1, 2000), new WH(300, 40), new WH(1, 40)],
  [new WH(100, 2000), new WH(3, 40), new WH(3, 40)]
])('min() %#) (%p, %p) => %p', (lhs, rhs, expected) =>
  expect(lhs.min(rhs)).toStrictEqual(expected)
)

test.each([
  [new WH(1, 20), new WH(300, 4000), new WH(300, 4000)],
  [new WH(100, 20), new WH(3, 4000), new WH(100, 4000)],
  [new WH(1, 2000), new WH(300, 40), new WH(300, 2000)],
  [new WH(100, 2000), new WH(3, 40), new WH(100, 2000)]
])('max() %#) (%p, %p) => %p', (lhs, rhs, expected) =>
  expect(lhs.max(rhs)).toStrictEqual(expected)
)

test('area()', () => expect(new WH(10, 200).area()).toStrictEqual(2000))

test.each([
  [new WH(10, 200), new WH(11, 201), new WH(1000, 1000), new WH(11, 201)],
  [new WH(10, 200), new WH(0, 0), new WH(1000, 1000), new WH(10, 200)],
  [new WH(10, 200), new WH(0, 0), new WH(9, 199), new WH(9, 199)]
])('clamp() %#) (%p, %p) => %p', (val, min, max, expected) =>
  expect(val.clamp(min, max)).toStrictEqual(expected)
)
