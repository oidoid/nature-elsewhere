import {Rect} from './rect'

/** [
      diagram: string,
      lhs: Rect,
      rhs: Rect,
      intersection: Rect,
      intersects: boolean,
      union: Rect,
      flip: boolean
    ] */
type Test = [string, Rect, Rect, Rect, boolean, Rect, boolean]
const tests: readonly Test[] = Object.freeze(
  [
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
      true,
      {x: -1, y: -1, w: 3, h: 2}
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
      true,
      {x: -1, y: -2, w: 3, h: 3}
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
      true,
      {x: -1, y: -2, w: 2, h: 3}
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
      true,
      {x: -2, y: -2, w: 3, h: 3}
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
      true,
      {x: -2, y: -1, w: 3, h: 2}
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
      true,
      {x: -2, y: -1, w: 3, h: 3}
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
      true,
      {x: -1, y: -1, w: 2, h: 3}
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
      true,
      {x: -1, y: -1, w: 3, h: 3}
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
      true,
      {x: -2, y: -3, w: 4, h: 5}
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
      true,
      {x: -2, y: -2, w: 4, h: 4}
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
      true,
      {x: -2, y: -2, w: 4, h: 5}
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
      true,
      {x: -3, y: -4, w: 5, h: 5}
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
      true,
      {x: -1, y: -1, w: 2, h: 2}
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
      false,
      {x: 0, y: 0, w: 0, h: 0}
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
      false,
      {x: -1, y: -1, w: 4, h: 2}
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
      false,
      {x: -1, y: -2, w: 4, h: 3}
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
      false,
      {x: -1, y: -3, w: 4, h: 4}
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
      false,
      {x: -1, y: -3, w: 3, h: 4}
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
      false,
      {x: -1, y: -3, w: 2, h: 4}
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
      false,
      {x: -2, y: -3, w: 3, h: 4}
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
      false,
      {x: -3, y: -3, w: 4, h: 4}
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
      false,
      {x: -3, y: -2, w: 4, h: 3}
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
      false,
      {x: -3, y: -1, w: 4, h: 2}
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
      false,
      {x: -3, y: -1, w: 4, h: 3}
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
      false,
      {x: -3, y: -1, w: 4, h: 4}
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
      false,
      {x: -2, y: -1, w: 3, h: 4}
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
      false,
      {x: -1, y: -1, w: 2, h: 4}
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
      false,
      {x: -1, y: -1, w: 3, h: 4}
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
      false,
      {x: -1, y: -1, w: 4, h: 4}
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
      false,
      {x: -1, y: -1, w: 4, h: 3}
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
      false,
      {x: -1, y: -1, w: 5, h: 2}
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
      false,
      {x: -1, y: -2, w: 5, h: 3}
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
      false,
      {x: -1, y: -4, w: 3, h: 5}
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
      false,
      {x: -1, y: -4, w: 2, h: 5}
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
      false,
      {x: -2, y: -4, w: 3, h: 5}
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
      false,
      {x: -4, y: -2, w: 5, h: 3}
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
      false,
      {x: -4, y: -1, w: 5, h: 2}
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
      false,
      {x: -4, y: -1, w: 5, h: 3}
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
      false,
      {x: -2, y: -1, w: 3, h: 5}
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
      false,
      {x: -1, y: -1, w: 2, h: 5}
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
      false,
      {x: -1, y: -1, w: 3, h: 5}
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
      false,
      {x: -1, y: -1, w: 5, h: 3}
    ],
    [
      `0 Distant Disjoint`,
      {x: 0, y: 0, w: 10, h: 10},
      {x: 17, y: -22, w: 8, h: 5},
      {x: 17, y: 0, w: -7, h: -17},
      false,
      {x: 0, y: -22, w: 25, h: 32}
    ],
    [
      `1 Distant Disjoint`,
      {x: 0, y: 0, w: 10, h: 10},
      {x: -17, y: -22, w: 8, h: 5},
      {x: 0, y: 0, w: -9, h: -17},
      false,
      {x: -17, y: -22, w: 27, h: 32}
    ],
    [
      `2 Distant Disjoint`,
      {x: 0, y: 0, w: 10, h: 10},
      {x: -17, y: 22, w: 8, h: 5},
      {x: 0, y: 22, w: -9, h: -12},
      false,
      {x: -17, y: 0, w: 27, h: 27}
    ],
    [
      `3 Distant Disjoint`,
      {x: 0, y: 0, w: 10, h: 10},
      {x: 17, y: 22, w: 8, h: 5},
      {x: 17, y: 22, w: -7, h: -12},
      false,
      {x: 0, y: 0, w: 25, h: 27}
    ],
    [
      `0 Disparate Disjoint`,
      {x: 100, y: 100, w: 400, h: 1000},
      {x: 20, y: -39, w: 12, h: 38},
      {x: 100, y: 100, w: -68, h: -101},
      false,
      {x: 20, y: -39, w: 480, h: 1139}
    ],
    [
      `1 Disparate Disjoint`,
      {x: 100, y: 100, w: 400, h: 1000},
      {x: -20, y: -39, w: 12, h: 38},
      {x: 100, y: 100, w: -108, h: -101},
      false,
      {x: -20, y: -39, w: 520, h: 1139}
    ],
    [
      `2 Disparate Disjoint`,
      {x: 100, y: 100, w: 400, h: 1000},
      {x: -20, y: 39, w: 12, h: 38},
      {x: 100, y: 100, w: -108, h: -23},
      false,
      {x: -20, y: 39, w: 520, h: 1061}
    ],
    [
      `3 Disparate Disjoint`,
      {x: 100, y: 100, w: 400, h: 1000},
      {x: 20, y: 39, w: 12, h: 38},
      {x: 100, y: 100, w: -68, h: -23},
      false,
      {x: 20, y: 39, w: 480, h: 1061}
    ]
  ].reduce(
    (ret: Test[], val) => [...ret, <Test>[...val, false], <Test>[...val, true]],
    []
  )
)

describe('intersection()', () => {
  test.each(tests)(
    '%#) %s (%p, %p) => %p %p, %p, flip=%p',
    (_diagram, lhs, rhs, intersection, _intersects, _union, flip) =>
      expect(
        Rect.intersection(flip ? rhs : lhs, flip ? lhs : rhs)
      ).toStrictEqual(intersection)
  )
})

describe('intersects()', () => {
  test.each(tests)(
    '%#) %s (%p, %p) => %p %p, %p, flip=%p',
    (_diagram, lhs, rhs, _intersection, intersects, _union, flip) =>
      expect(Rect.intersects(flip ? rhs : lhs, flip ? lhs : rhs)).toStrictEqual(
        intersects
      )
  )
})

describe('union()', () =>
  test.each(tests)(
    '%#) %s (%p, %p) => %p %p, %p, %p',
    (_diagram, lhs, rhs, _intersection, _intersects, union, flip) =>
      expect(Rect.union(flip ? rhs : lhs, flip ? lhs : rhs)).toStrictEqual(
        union
      )
  ))
