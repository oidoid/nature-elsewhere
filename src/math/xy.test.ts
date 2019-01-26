import * as xy from './xy'

describe('max()', () => {
  test.each([
    [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],

    [{x: 1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}],
    [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 0}],
    [{x: 0, y: 1}, {x: 0, y: 0}, {x: 0, y: 1}],
    [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 1}],

    [{x: -1, y: -2}, {x: -3, y: -4}, {x: -1, y: -2}],
    [{x: -1, y: -4}, {x: -3, y: -2}, {x: -1, y: -2}],
    [{x: -3, y: -2}, {x: -1, y: -4}, {x: -1, y: -2}],

    [{x: 1, y: 2}, {x: 3, y: 4}, {x: 3, y: 4}],
    [{x: 1, y: 4}, {x: 3, y: 2}, {x: 3, y: 4}],
    [{x: 3, y: 2}, {x: 1, y: 4}, {x: 3, y: 4}]
  ])('%#) (%p, %p) => %p', (lhs: XY, rhs: XY, expected: XY) =>
    expect(xy.max(lhs, rhs)).toStrictEqual(expected)
  )
})
