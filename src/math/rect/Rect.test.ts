import {Rect} from './Rect'

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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -1}, size: {w: 1, h: 2}},
      true,
      {position: {x: -1, y: -1}, size: {w: 3, h: 2}}
    ],
    [
      `
      1   ├───┐Overlapping Square
        ┌─╆━┓R│
      ──┼─╄L╃─┴
        └─┼─┘
          │
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -2}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -1}, size: {w: 1, h: 1}},
      true,
      {position: {x: -1, y: -2}, size: {w: 3, h: 3}}
    ],
    [
      `
      2 ┌─R─┐  Overlapping Square
        ┢━┿━┪
      ──┡━┿L┩──
        └─┼─┘
          │
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -2}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 2, h: 1}},
      true,
      {position: {x: -1, y: -2}, size: {w: 2, h: 3}}
    ],
    [
      `
      3───┤    Overlapping Square
      │R┏━╅─┐
      ┴─╄━╃L┼──
        └─┼─┘
          │
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -2, y: -2}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 1, h: 1}},
      true,
      {position: {x: -2, y: -2}, size: {w: 3, h: 3}}
    ],
    [
      `
      4   │    Overlapping Square
      ┌─┲━╅─┐
      ┼R╂─╂L┼──
      └─┺━╃─┘
          │
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -2, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 1, h: 2}},
      true,
      {position: {x: -2, y: -1}, size: {w: 3, h: 2}}
    ],
    [
      `
      5   │    Overlapping Square
        ┌─┼─┐
      ┬─╆━╅L┼──
      │R┗━╃─┘
      └───┤
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -2, y: 0}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 0}, size: {w: 1, h: 1}},
      true,
      {position: {x: -2, y: -1}, size: {w: 3, h: 3}}
    ],
    [
      `
      6   │    Overlapping Square
        ┌─┼─┐
      ──╆━┿L╅──
        ┡━┿━┩
        └─R─┘
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 0}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 0}, size: {w: 2, h: 1}},
      true,
      {position: {x: -1, y: -1}, size: {w: 2, h: 3}}
    ],
    [
      `
      7   │    Overlapping Square
        ┌─┼─┐
      ──┼─╆L╅─┬
        └─╄━┛R│
          ├───┘
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: 0}, size: {w: 2, h: 2}},
      {position: {x: 0, y: 0}, size: {w: 1, h: 1}},
      true,
      {position: {x: -1, y: -1}, size: {w: 3, h: 3}}
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
      {position: {x: -1, y: -2}, size: {w: 2, h: 4}},
      {position: {x: -2, y: -3}, size: {w: 4, h: 2}},
      {position: {x: -1, y: -2}, size: {w: 2, h: 1}},
      true,
      {position: {x: -2, y: -3}, size: {w: 4, h: 5}}
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
      {position: {x: -1, y: -2}, size: {w: 2, h: 4}},
      {position: {x: -2, y: -1}, size: {w: 4, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      true,
      {position: {x: -2, y: -2}, size: {w: 4, h: 4}}
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
      {position: {x: -1, y: -2}, size: {w: 2, h: 4}},
      {position: {x: -2, y: 1}, size: {w: 4, h: 2}},
      {position: {x: -1, y: 1}, size: {w: 2, h: 1}},
      true,
      {position: {x: -2, y: -2}, size: {w: 4, h: 5}}
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
      {position: {x: -3, y: -4}, size: {w: 5, h: 5}},
      {position: {x: -2, y: -2}, size: {w: 1, h: 2}},
      {position: {x: -2, y: -2}, size: {w: 1, h: 2}},
      true,
      {position: {x: -3, y: -4}, size: {w: 5, h: 5}}
    ],
    [
      `
          │Identical
        ┏━┿━┓
      ──╂R┼L╂──
        ┗━┿━┛
          │
    `,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      true,
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}}
    ],
    [
      `
          │Empty
          │
      ────┼────
          │
          │
    `,
      {position: {x: 0, y: 0}, size: {w: 0, h: 0}},
      {position: {x: 0, y: 0}, size: {w: 0, h: 0}},
      {position: {x: 0, y: 0}, size: {w: 0, h: 0}},
      false,
      {position: {x: 0, y: 0}, size: {w: 0, h: 0}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 1, y: -1}, size: {w: 0, h: 2}},
      false,
      {position: {x: -1, y: -1}, size: {w: 4, h: 2}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 1, y: -2}, size: {w: 2, h: 2}},
      {position: {x: 1, y: -1}, size: {w: 0, h: 1}},
      false,
      {position: {x: -1, y: -2}, size: {w: 4, h: 3}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 1, y: -3}, size: {w: 2, h: 2}},
      {position: {x: 1, y: -1}, size: {w: 0, h: 0}},
      false,
      {position: {x: -1, y: -3}, size: {w: 4, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -3}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -1}, size: {w: 1, h: 0}},
      false,
      {position: {x: -1, y: -3}, size: {w: 3, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -3}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 2, h: 0}},
      false,
      {position: {x: -1, y: -3}, size: {w: 2, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -2, y: -3}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 1, h: 0}},
      false,
      {position: {x: -2, y: -3}, size: {w: 3, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -3, y: -3}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 0, h: 0}},
      false,
      {position: {x: -3, y: -3}, size: {w: 4, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -3, y: -2}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 0, h: 1}},
      false,
      {position: {x: -3, y: -2}, size: {w: 4, h: 3}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -3, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 0, h: 2}},
      false,
      {position: {x: -3, y: -1}, size: {w: 4, h: 2}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -3, y: 0}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 0}, size: {w: 0, h: 1}},
      false,
      {position: {x: -3, y: -1}, size: {w: 4, h: 3}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -3, y: 1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 1}, size: {w: 0, h: 0}},
      false,
      {position: {x: -3, y: -1}, size: {w: 4, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -2, y: 1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 1}, size: {w: 1, h: 0}},
      false,
      {position: {x: -2, y: -1}, size: {w: 3, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 1}, size: {w: 2, h: 0}},
      false,
      {position: {x: -1, y: -1}, size: {w: 2, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: 1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: 1}, size: {w: 1, h: 0}},
      false,
      {position: {x: -1, y: -1}, size: {w: 3, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 1, y: 1}, size: {w: 2, h: 2}},
      {position: {x: 1, y: 1}, size: {w: 0, h: 0}},
      false,
      {position: {x: -1, y: -1}, size: {w: 4, h: 4}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 1, y: 0}, size: {w: 2, h: 2}},
      {position: {x: 1, y: 0}, size: {w: 0, h: 1}},
      false,
      {position: {x: -1, y: -1}, size: {w: 4, h: 3}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 2, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 2, y: -1}, size: {w: -1, h: 2}},
      false,
      {position: {x: -1, y: -1}, size: {w: 5, h: 2}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 2, y: -2}, size: {w: 2, h: 2}},
      {position: {x: 2, y: -1}, size: {w: -1, h: 1}},
      false,
      {position: {x: -1, y: -2}, size: {w: 5, h: 3}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -4}, size: {w: 2, h: 2}},
      {position: {x: 0, y: -1}, size: {w: 1, h: -1}},
      false,
      {position: {x: -1, y: -4}, size: {w: 3, h: 5}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -4}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 2, h: -1}},
      false,
      {position: {x: -1, y: -4}, size: {w: 2, h: 5}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -2, y: -4}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: 1, h: -1}},
      false,
      {position: {x: -2, y: -4}, size: {w: 3, h: 5}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -4, y: -2}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: -1, h: 1}},
      false,
      {position: {x: -4, y: -2}, size: {w: 5, h: 3}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -4, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: -1}, size: {w: -1, h: 2}},
      false,
      {position: {x: -4, y: -1}, size: {w: 5, h: 2}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -4, y: 0}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 0}, size: {w: -1, h: 1}},
      false,
      {position: {x: -4, y: -1}, size: {w: 5, h: 3}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -2, y: 2}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 2}, size: {w: 1, h: -1}},
      false,
      {position: {x: -2, y: -1}, size: {w: 3, h: 5}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 2}, size: {w: 2, h: 2}},
      {position: {x: -1, y: 2}, size: {w: 2, h: -1}},
      false,
      {position: {x: -1, y: -1}, size: {w: 2, h: 5}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 0, y: 2}, size: {w: 2, h: 2}},
      {position: {x: 0, y: 2}, size: {w: 1, h: -1}},
      false,
      {position: {x: -1, y: -1}, size: {w: 3, h: 5}}
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
      {position: {x: -1, y: -1}, size: {w: 2, h: 2}},
      {position: {x: 2, y: 0}, size: {w: 2, h: 2}},
      {position: {x: 2, y: 0}, size: {w: -1, h: 1}},
      false,
      {position: {x: -1, y: -1}, size: {w: 5, h: 3}}
    ],
    [
      `0 Distant Disjoint`,
      {position: {x: 0, y: 0}, size: {w: 10, h: 10}},
      {position: {x: 17, y: -22}, size: {w: 8, h: 5}},
      {position: {x: 17, y: 0}, size: {w: -7, h: -17}},
      false,
      {position: {x: 0, y: -22}, size: {w: 25, h: 32}}
    ],
    [
      `1 Distant Disjoint`,
      {position: {x: 0, y: 0}, size: {w: 10, h: 10}},
      {position: {x: -17, y: -22}, size: {w: 8, h: 5}},
      {position: {x: 0, y: 0}, size: {w: -9, h: -17}},
      false,
      {position: {x: -17, y: -22}, size: {w: 27, h: 32}}
    ],
    [
      `2 Distant Disjoint`,
      {position: {x: 0, y: 0}, size: {w: 10, h: 10}},
      {position: {x: -17, y: 22}, size: {w: 8, h: 5}},
      {position: {x: 0, y: 22}, size: {w: -9, h: -12}},
      false,
      {position: {x: -17, y: 0}, size: {w: 27, h: 27}}
    ],
    [
      `3 Distant Disjoint`,
      {position: {x: 0, y: 0}, size: {w: 10, h: 10}},
      {position: {x: 17, y: 22}, size: {w: 8, h: 5}},
      {position: {x: 17, y: 22}, size: {w: -7, h: -12}},
      false,
      {position: {x: 0, y: 0}, size: {w: 25, h: 27}}
    ],
    [
      `0 Disparate Disjoint`,
      {position: {x: 100, y: 100}, size: {w: 400, h: 1000}},
      {position: {x: 20, y: -39}, size: {w: 12, h: 38}},
      {position: {x: 100, y: 100}, size: {w: -68, h: -101}},
      false,
      {position: {x: 20, y: -39}, size: {w: 480, h: 1139}}
    ],
    [
      `1 Disparate Disjoint`,
      {position: {x: 100, y: 100}, size: {w: 400, h: 1000}},
      {position: {x: -20, y: -39}, size: {w: 12, h: 38}},
      {position: {x: 100, y: 100}, size: {w: -108, h: -101}},
      false,
      {position: {x: -20, y: -39}, size: {w: 520, h: 1139}}
    ],
    [
      `2 Disparate Disjoint`,
      {position: {x: 100, y: 100}, size: {w: 400, h: 1000}},
      {position: {x: -20, y: 39}, size: {w: 12, h: 38}},
      {position: {x: 100, y: 100}, size: {w: -108, h: -23}},
      false,
      {position: {x: -20, y: 39}, size: {w: 520, h: 1061}}
    ],
    [
      `3 Disparate Disjoint`,
      {position: {x: 100, y: 100}, size: {w: 400, h: 1000}},
      {position: {x: 20, y: 39}, size: {w: 12, h: 38}},
      {position: {x: 100, y: 100}, size: {w: -68, h: -23}},
      false,
      {position: {x: 20, y: 39}, size: {w: 480, h: 1061}}
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
