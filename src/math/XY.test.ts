import {XY} from './XY'

describe('max()', () => {
  test.each([
    [new XY(0, 0), new XY(0, 0), new XY(0, 0)],

    [new XY(1, 0), new XY(0, 0), new XY(1, 0)],
    [new XY(0, 0), new XY(1, 0), new XY(1, 0)],
    [new XY(0, 1), new XY(0, 0), new XY(0, 1)],
    [new XY(0, 0), new XY(0, 1), new XY(0, 1)],

    [new XY(-1, -2), new XY(-3, -4), new XY(-1, -2)],
    [new XY(-1, -4), new XY(-3, -2), new XY(-1, -2)],
    [new XY(-3, -2), new XY(-1, -4), new XY(-1, -2)],

    [new XY(1, 2), new XY(3, 4), new XY(3, 4)],
    [new XY(1, 4), new XY(3, 2), new XY(3, 4)],
    [new XY(3, 2), new XY(1, 4), new XY(3, 4)]
  ])('%#) (%p, %p) => %p', (lhs, rhs, expected) =>
    expect(lhs.max(rhs)).toStrictEqual(expected)
  )
})
