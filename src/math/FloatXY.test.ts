import {FloatXY} from './FloatXY'

test.each<[Readonly<FloatXY>, Readonly<FloatXY>, boolean]>([
  // Unequal.
  [{x: 1, y: 20}, {x: 300, y: 4000}, false],
  [{x: 300, y: 4000}, {x: 1, y: 20}, false],

  // Equal.
  [{x: 1, y: 20}, {x: 1, y: 20}, true]
])('equal() %#) (%p, %p) => %p', (lhs, rhs, expected) =>
  expect(FloatXY.equal(lhs, rhs)).toStrictEqual(expected)
)

test('add()', () =>
  expect(FloatXY.add({x: 1, y: 20}, {x: 300, y: 4000})).toStrictEqual({
    x: 301,
    y: 4020
  }))

test('sub()', () =>
  expect(FloatXY.sub({x: 1, y: 20}, {x: 300, y: 4000})).toStrictEqual({
    x: -299,
    y: -3980
  }))

test('mul()', () =>
  expect(FloatXY.mul({x: 10, y: 200}, {x: 3000, y: 40_000})).toStrictEqual({
    x: 30_000,
    y: 8_000_000
  }))

test('div()', () =>
  expect(FloatXY.div({x: 1, y: 20}, {x: 300, y: 4000})).toStrictEqual({
    x: 1 / 300,
    y: 20 / 4000
  }))

test.each([
  [{x: -1, y: -20}, {x: 1, y: 20}],
  [{x: 1, y: 20}, {x: 1, y: 20}]
])('abs() %#) (%p, %p) => %p', (xy, expected) =>
  expect(FloatXY.abs(xy)).toStrictEqual(expected)
)

test.each([
  [{x: 1, y: 20}, {x: 300, y: 4000}, {x: 1, y: 20}],
  [{x: 100, y: 20}, {x: 3, y: 4000}, {x: 3, y: 20}],
  [{x: 1, y: 2000}, {x: 300, y: 40}, {x: 1, y: 40}],
  [{x: 100, y: 2000}, {x: 3, y: 40}, {x: 3, y: 40}]
])('min() %#) (%p, %p) => %p', (lhs, rhs, expected) =>
  expect(FloatXY.min(lhs, rhs)).toStrictEqual(expected)
)

test.each([
  [{x: 1, y: 20}, {x: 300, y: 4000}, {x: 300, y: 4000}],
  [{x: 100, y: 20}, {x: 3, y: 4000}, {x: 100, y: 4000}],
  [{x: 1, y: 2000}, {x: 300, y: 40}, {x: 300, y: 2000}],
  [{x: 100, y: 2000}, {x: 3, y: 40}, {x: 100, y: 2000}]
])('max() %#) (%p, %p) => %p', (lhs, rhs, expected) =>
  expect(FloatXY.max(lhs, rhs)).toStrictEqual(expected)
)

test('magnitude()', () =>
  expect(FloatXY.magnitude({x: Math.sqrt(2), y: Math.sqrt(2)})).toStrictEqual(
    2
  ))

test.each([
  [{x: 10, y: 200}, {x: 11, y: 201}, {x: 1000, y: 1000}, {x: 11, y: 201}],
  [{x: 10, y: 200}, {x: 0, y: 0}, {x: 1000, y: 1000}, {x: 10, y: 200}],
  [{x: 10, y: 200}, {x: 0, y: 0}, {x: 9, y: 199}, {x: 9, y: 199}]
])('clamp() %#) (%p, %p) => %p', (val, min, max, expected) =>
  expect(FloatXY.clamp(val, min, max)).toStrictEqual(expected)
)

test.each<[Readonly<FloatXY>, Readonly<FloatXY>, number, Readonly<FloatXY>]>([
  [{x: 1, y: 20}, {x: 300, y: 4000}, 0, {x: 1, y: 20}],
  [{x: 1, y: 20}, {x: 300, y: 4000}, 1, {x: 300, y: 4000}]
])('clamp() %#) (%p, %p) => %p', (from, to, ratio, expected) =>
  expect(FloatXY.lerp(from, to, ratio)).toStrictEqual(expected)
)
