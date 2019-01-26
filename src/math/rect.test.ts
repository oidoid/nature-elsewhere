import * as rect from './rect'

/**
 * [
 *   diagram: string,
 *   lhs: Rect,
 *   rhs: Rect,
 *   intersections: Rect,
 *   intersects: boolean,
 *   flip: boolean
 * ]
 */
const intersections = [
  [
    `
      0   │    Overlapping Square
        ┌─╆━┱─┐
      ──┼─╂L╂R┼
        └─╄━┹─┘
          │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 0, y: -1, w: 2, h: 2},
    {x: 0, y: -1, w: 1, h: 2},
    true
  ],
  [
    `
      1   ├───┐Overlapping Square
        ┌─╆━┓R│
      ──┼─╄L╃─┴
        └─┼─┘
          │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 0, y: -2, w: 2, h: 2},
    {x: 0, y: -1, w: 1, h: 1},
    true
  ],
  [
    `
      2 ┌─R─┐  Overlapping Square
        ┢━┿━┪
      ──┡━┿L┩──
        └─┼─┘
          │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: -2, w: 2, h: 2},
    {x: -1, y: -1, w: 2, h: 1},
    true
  ],
  [
    `
      3───┤    Overlapping Square
      │R┏━╅─┐
      ┴─╄━╃L┼──
        └─┼─┘
          │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -2, y: -2, w: 2, h: 2},
    {x: -1, y: -1, w: 1, h: 1},
    true
  ],
  [
    `
      4   │    Overlapping Square
      ┌─┲━╅─┐
      ┼R╂─╂L┼──
      └─┺━╃─┘
          │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -2, y: -1, w: 2, h: 2},
    {x: -1, y: -1, w: 1, h: 2},
    true
  ],
  [
    `
      5   │    Overlapping Square
        ┌─┼─┐
      ┬─╆━╅L┼──
      │R┗━╃─┘
      └───┤
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -2, y: 0, w: 2, h: 2},
    {x: -1, y: 0, w: 1, h: 1},
    true
  ],
  [
    `
      6   │    Overlapping Square
        ┌─┼─┐
      ──╆━┿L╅──
        ┡━┿━┩
        └─R─┘
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: 0, w: 2, h: 2},
    {x: -1, y: 0, w: 2, h: 1},
    true
  ],
  [
    `
      7   │    Overlapping Square
        ┌─┼─┐
      ──┼─╆L╅─┬
        └─╄━┛R│
          ├───┘
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 0, y: 0, w: 2, h: 2},
    {x: 0, y: 0, w: 1, h: 1},
    true
  ],
  [
    `
      0 ┌───┼───┐Overlapping Oblong
        │ ┏━┿━┓R│
        └─╄━┿━╃─┘
      ────┼─┼L┼────
          │ │ │
          └─┼─┘
            │
    `,
    {x: -1, y: -2, w: 2, h: 4},
    {x: -2, y: -3, w: 4, h: 2},
    {x: -1, y: -2, w: 2, h: 1},
    true
  ],
  [
    `
      1     │    Overlapping Oblong
          ┌─┼─┐
        ┌─╆━┿━┪─┐
      ──┼─╂─┼L╂R┼──
        └─╄━┿━╃─┘
          └─┼─┘
            │
    `,
    {x: -1, y: -2, w: 2, h: 4},
    {x: -2, y: -1, w: 4, h: 2},
    {x: -1, y: -1, w: 2, h: 2},
    true
  ],
  [
    `
      2     │    Overlapping Oblong
          ┌─┼─┐
          │ │ │
      ────┼─┼L┼────
        ┌─╆━┿━┪─┐
        │ ┗━┿━┛R│
        └───┼───┘
    `,
    {x: -1, y: -2, w: 2, h: 4},
    {x: -2, y: 1, w: 4, h: 2},
    {x: -1, y: 1, w: 2, h: 1},
    true
  ],
  [
    `
      ┌────┼───┐Island
      │┏━┓ │   │
      │┃R┃ │   │
      │┗━┛ │ L │
      ┼────┼───┼
      └────┼───┘
    `,
    {x: -3, y: -4, w: 5, h: 5},
    {x: -2, y: -2, w: 1, h: 2},
    {x: -2, y: -2, w: 1, h: 2},
    true
  ],
  [
    `
          │Identical
        ┏━┿━┓
      ──╂R┼L╂──
        ┗━┿━┛
          │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: -1, w: 2, h: 2},
    true
  ],
  [
    `
          │Empty
          │
      ────┼────
          │
          │
    `,
    {x: 0, y: 0, w: 0, h: 0},
    {x: 0, y: 0, w: 0, h: 0},
    {x: 0, y: 0, w: 0, h: 0},
    true
  ],
  [
    `
      0     │      Touching
            │
          ┌─┼─┰───┐
      ────┼─┼L╂──R┼
          └─┼─┸───┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 1, y: -1, w: 2, h: 2},
    {x: 1, y: -1, w: 0, h: 2},
    true
  ],
  [
    `
      1     │      Touching
            │ ┌───┐
          ┌─┼─┧  R│
      ────┼─┼L╀───┴
          └─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 1, y: -2, w: 2, h: 2},
    {x: 1, y: -1, w: 0, h: 1},
    true
  ],
  [
    `
      2     │ ┌───┐Touching
            │ │  R│
          ┌─┼─┼───┘
      ────┼─┼L┼────
          └─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 1, y: -3, w: 2, h: 2},
    {x: 1, y: -1, w: 0, h: 0},
    true
  ],
  [
    `
      3     ├───┐Touching
            │  R│
          ┌─┾━┭─┘
      ────┼─┼L┼────
          └─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 0, y: -3, w: 2, h: 2},
    {x: 0, y: -1, w: 1, h: 0},
    true
  ],
  [
    `
      4   ┌─┼─┐    Touching
          │ │R│
          ┝━┿━┥
      ────┼─┼L┼───
          └─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: -3, w: 2, h: 2},
    {x: -1, y: -1, w: 2, h: 0},
    true
  ],
  [
    `
      5 ┌───┼      Touching
        │  R│
        └─┮━┽─┐
      ────┼─┼L┼────
          └─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -2, y: -3, w: 2, h: 2},
    {x: -1, y: -1, w: 1, h: 0},
    true
  ],
  [
    `
      6───┐ │      Touching
      │  R│ │
      └───┼─┼─┐
      ────┼─┼L┼────
          └─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -3, y: -3, w: 2, h: 2},
    {x: -1, y: -1, w: 0, h: 0},
    true
  ],
  [
    `
      7     │      Touching
      ┌───┐ │
      │  R┟─┼─┐
      ┴───╀─┼L┼───
          └─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -3, y: -2, w: 2, h: 2},
    {x: -1, y: -1, w: 0, h: 1},
    true
  ],
  [
    `
      8     │      Touching
            │
      ┌───┰─┼─┐
      ┼──R╂─┼L┼───
      └───┸─┼─┘
            │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -3, y: -1, w: 2, h: 2},
    {x: -1, y: -1, w: 0, h: 2},
    true
  ],
  [
    `
      9     │      Touching
            │
          ┌─┼─┐
      ┬───╁─┼L┼───
      │  R┞─┼─┘
      └───┘ │
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -3, y: 0, w: 2, h: 2},
    {x: -1, y: 0, w: 0, h: 1},
    true
  ],
  [
    `
      10    │      Touching
            │
          ┌─┼─┐
      ────┼─┼L┼────
      ┌───┼─┼─┘
      │  R│ │
      └───┘ │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -3, y: 1, w: 2, h: 2},
    {x: -1, y: 1, w: 0, h: 0},
    true
  ],
  [
    `
      11    │      Touching
            │
          ┌─┼─┐
      ────┼─┼L┼────
        ┌─┶━┽─┘
        │  R│
        └───┤
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -2, y: 1, w: 2, h: 2},
    {x: -1, y: 1, w: 1, h: 0},
    true
  ],
  [
    `
      12    │      Touching
            │
          ┌─┼─┐
      ────┼─┼L┼───
          ┝━┿━┥
          │ │R│
          └─┼─┘
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: 1, w: 2, h: 2},
    {x: -1, y: 1, w: 2, h: 0},
    true
  ],
  [
    `
      13    │      Touching
            │
          ┌─┼─┐
      ────┼─┼L┼────
          └─┾━┵─┐
            │  R│
            ├───┘
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 0, y: 1, w: 2, h: 2},
    {x: 0, y: 1, w: 1, h: 0},
    true
  ],
  [
    `
      14    │      Touching
            │
          ┌─┼─┐
      ────┼─┼L┼────
          └─┼─┼───┐
            │ │  R│
            │ └───┘
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 1, y: 1, w: 2, h: 2},
    {x: 1, y: 1, w: 0, h: 0},
    true
  ],
  [
    `
      15    │      Touching
            │
          ┌─┼─┐
      ────┼─┼L╁───┬
          └─┼─┦  R│
            │ └───┘
            │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 1, y: 0, w: 2, h: 2},
    {x: 1, y: 0, w: 0, h: 1},
    true
  ],
  [
    `
      0      │    Disjoint
             │
             │
           ┌─┼─┐┌───┐
      ─────┼─┼L┼┼──R┼
           └─┼─┘└───┘
             │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 2, y: -1, w: 2, h: 2},
    {x: 2, y: -1, w: -1, h: 2},
    false
  ],
  [
    `
      1      │    Disjoint
             │
             │  ┌───┐
           ┌─┼─┐│  R│
      ─────┼─┼L┼┴───┴
           └─┼─┘
             │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 2, y: -2, w: 2, h: 2},
    {x: 2, y: -1, w: -1, h: 1},
    false
  ],
  [
    `
      2      ├───┐Disjoint
             │  R│
             ├───┘
           ┌─┼─┐
      ─────┼─┼L┼─────
           └─┼─┘
             │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 0, y: -4, w: 2, h: 2},
    {x: 0, y: -1, w: 1, h: -1},
    false
  ],
  [
    `
      3    ┌─┼─┐  Disjoint
           │ │R│
           └─┼─┘
           ┌─┼─┐
      ─────┼─┼L┼─────
           └─┼─┘
             │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: -4, w: 2, h: 2},
    {x: -1, y: -1, w: 2, h: -1},
    false
  ],
  [
    `
      4  ┌───┤    Disjoint
         │  R│
         └───┤
           ┌─┼─┐
      ─────┼─┼L┼─────
           └─┼─┘
             │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -2, y: -4, w: 2, h: 2},
    {x: -1, y: -1, w: 1, h: -1},
    false
  ],
  [
    `
      5      │    Disjoint
             │
      ┌───┐  │
      │  R│┌─┼─┐
      ┴───┴┼─┼L┼─────
           └─┼─┘
             │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -4, y: -2, w: 2, h: 2},
    {x: -1, y: -1, w: -1, h: 1},
    false
  ],
  [
    `
      6      │    Disjoint
             │
             │
      ┌───┐┌─┼─┐
      ┼──R┼┼─┼L┼─────
      └───┘└─┼─┘
             │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -4, y: -1, w: 2, h: 2},
    {x: -1, y: -1, w: -1, h: 2},
    false
  ],
  [
    `
      7      │    Disjoint
             │
             │
           ┌─┼─┐
      ┬───┬┼─┼L┼─────
      │  R│└─┼─┘
      └───┘  │
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -4, y: 0, w: 2, h: 2},
    {x: -1, y: 0, w: -1, h: 1},
    false
  ],
  [
    `
      8      │    Disjoint
             │
             │
           ┌─┼─┐
      ─────┼─┼L┼─────
           └─┼─┘
         ┌───┤
         │  R│
         └───┤
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -2, y: 2, w: 2, h: 2},
    {x: -1, y: 2, w: 1, h: -1},
    false
  ],
  [
    `
      9      │    Disjoint
             │
             │
           ┌─┼─┐
      ─────┼─┼L┼─────
           └─┼─┘
           ┌─┼─┐
           │ │R│
           └─┼─┘
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: -1, y: 2, w: 2, h: 2},
    {x: -1, y: 2, w: 2, h: -1},
    false
  ],
  [
    `
      10     │    Disjoint
             │
             │
           ┌─┼─┐
      ─────┼─┼L┼─────
           └─┼─┘
             ├───┐
             │  R│
             ├───┘
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 0, y: 2, w: 2, h: 2},
    {x: 0, y: 2, w: 1, h: -1},
    false
  ],
  [
    `
      11     │    Disjoint
             │
             │
           ┌─┼─┐
      ─────┼─┼L┼┬───┬
           └─┼─┘│  R│
             │  └───┘
             │
             │
    `,
    {x: -1, y: -1, w: 2, h: 2},
    {x: 2, y: 0, w: 2, h: 2},
    {x: 2, y: 0, w: -1, h: 1},
    false
  ],
  [
    `0 Distant Disjoint`,
    {x: 0, y: 0, w: 10, h: 10},
    {x: 17, y: -22, w: 8, h: 5},
    {x: 17, y: 0, w: -7, h: -17},
    false
  ],
  [
    `1 Distant Disjoint`,
    {x: 0, y: 0, w: 10, h: 10},
    {x: -17, y: -22, w: 8, h: 5},
    {x: 0, y: 0, w: -9, h: -17},
    false
  ],
  [
    `2 Distant Disjoint`,
    {x: 0, y: 0, w: 10, h: 10},
    {x: -17, y: 22, w: 8, h: 5},
    {x: 0, y: 22, w: -9, h: -12},
    false
  ],
  [
    `3 Distant Disjoint`,
    {x: 0, y: 0, w: 10, h: 10},
    {x: 17, y: 22, w: 8, h: 5},
    {x: 17, y: 22, w: -7, h: -12},
    false
  ],
  [
    `0 Disparate Disjoint`,
    {x: 100, y: 100, w: 400, h: 1000},
    {x: 20, y: -39, w: 12, h: 38},
    {x: 100, y: 100, w: -68, h: -101},
    false
  ],
  [
    `1 Disparate Disjoint`,
    {x: 100, y: 100, w: 400, h: 1000},
    {x: -20, y: -39, w: 12, h: 38},
    {x: 100, y: 100, w: -108, h: -101},
    false
  ],
  [
    `2 Disparate Disjoint`,
    {x: 100, y: 100, w: 400, h: 1000},
    {x: -20, y: 39, w: 12, h: 38},
    {x: 100, y: 100, w: -108, h: -23},
    false
  ],
  [
    `3 Disparate Disjoint`,
    {x: 100, y: 100, w: 400, h: 1000},
    {x: 20, y: 39, w: 12, h: 38},
    {x: 100, y: 100, w: -68, h: -23},
    false
  ]
].reduce((sum, val) => [...sum, [...val, false], [...val, true]], <
  (string | Rect | boolean)[][]
>[])

describe('intersection()', () => {
  test.each(intersections)(
    '%#) %s (%p, %p) => %p %p, %p',
    (
      _diagram: string,
      lhs: Rect,
      rhs: Rect,
      intersection: Rect,
      _intersects: Rect,
      flip: boolean
    ) =>
      expect(
        rect.intersection(flip ? rhs : lhs, flip ? lhs : rhs)
      ).toStrictEqual(intersection)
  )
})

describe('intersects()', () => {
  test.each(intersections)(
    '%#) %s (%p, %p) => %p %p, %p',
    (
      _diagram: string,
      lhs: Rect,
      rhs: Rect,
      _intersection: Rect,
      intersects: Rect,
      flip: boolean
    ) =>
      expect(rect.intersects(flip ? rhs : lhs, flip ? lhs : rhs)).toStrictEqual(
        intersects
      )
  )
})
