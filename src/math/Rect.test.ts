import {Rect} from './Rect'
import {WH} from './WH'
import {XY} from './XY'

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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(0, -1), size: new WH(2, 2)},
      {position: new XY(0, -1), size: new WH(1, 2)},
      true,
      {position: new XY(-1, -1), size: new WH(3, 2)}
    ],
    [
      `
      1   ├───┐Overlapping Square
        ┌─╆━┓R│
      ──┼─╄L╃─┴
        └─┼─┘
          │
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(0, -2), size: new WH(2, 2)},
      {position: new XY(0, -1), size: new WH(1, 1)},
      true,
      {position: new XY(-1, -2), size: new WH(3, 3)}
    ],
    [
      `
      2 ┌─R─┐  Overlapping Square
        ┢━┿━┪
      ──┡━┿L┩──
        └─┼─┘
          │
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, -2), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(2, 1)},
      true,
      {position: new XY(-1, -2), size: new WH(2, 3)}
    ],
    [
      `
      3───┤    Overlapping Square
      │R┏━╅─┐
      ┴─╄━╃L┼──
        └─┼─┘
          │
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-2, -2), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(1, 1)},
      true,
      {position: new XY(-2, -2), size: new WH(3, 3)}
    ],
    [
      `
      4   │    Overlapping Square
      ┌─┲━╅─┐
      ┼R╂─╂L┼──
      └─┺━╃─┘
          │
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-2, -1), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(1, 2)},
      true,
      {position: new XY(-2, -1), size: new WH(3, 2)}
    ],
    [
      `
      5   │    Overlapping Square
        ┌─┼─┐
      ┬─╆━╅L┼──
      │R┗━╃─┘
      └───┤
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-2, 0), size: new WH(2, 2)},
      {position: new XY(-1, 0), size: new WH(1, 1)},
      true,
      {position: new XY(-2, -1), size: new WH(3, 3)}
    ],
    [
      `
      6   │    Overlapping Square
        ┌─┼─┐
      ──╆━┿L╅──
        ┡━┿━┩
        └─R─┘
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, 0), size: new WH(2, 2)},
      {position: new XY(-1, 0), size: new WH(2, 1)},
      true,
      {position: new XY(-1, -1), size: new WH(2, 3)}
    ],
    [
      `
      7   │    Overlapping Square
        ┌─┼─┐
      ──┼─╆L╅─┬
        └─╄━┛R│
          ├───┘
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(0, 0), size: new WH(2, 2)},
      {position: new XY(0, 0), size: new WH(1, 1)},
      true,
      {position: new XY(-1, -1), size: new WH(3, 3)}
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
      {position: new XY(-1, -2), size: new WH(2, 4)},
      {position: new XY(-2, -3), size: new WH(4, 2)},
      {position: new XY(-1, -2), size: new WH(2, 1)},
      true,
      {position: new XY(-2, -3), size: new WH(4, 5)}
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
      {position: new XY(-1, -2), size: new WH(2, 4)},
      {position: new XY(-2, -1), size: new WH(4, 2)},
      {position: new XY(-1, -1), size: new WH(2, 2)},
      true,
      {position: new XY(-2, -2), size: new WH(4, 4)}
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
      {position: new XY(-1, -2), size: new WH(2, 4)},
      {position: new XY(-2, 1), size: new WH(4, 2)},
      {position: new XY(-1, 1), size: new WH(2, 1)},
      true,
      {position: new XY(-2, -2), size: new WH(4, 5)}
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
      {position: new XY(-3, -4), size: new WH(5, 5)},
      {position: new XY(-2, -2), size: new WH(1, 2)},
      {position: new XY(-2, -2), size: new WH(1, 2)},
      true,
      {position: new XY(-3, -4), size: new WH(5, 5)}
    ],
    [
      `
          │Identical
        ┏━┿━┓
      ──╂R┼L╂──
        ┗━┿━┛
          │
    `,
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(2, 2)},
      true,
      {position: new XY(-1, -1), size: new WH(2, 2)}
    ],
    [
      `
          │Empty
          │
      ────┼────
          │
          │
    `,
      {position: new XY(0, 0), size: new WH(0, 0)},
      {position: new XY(0, 0), size: new WH(0, 0)},
      {position: new XY(0, 0), size: new WH(0, 0)},
      false,
      {position: new XY(0, 0), size: new WH(0, 0)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(1, -1), size: new WH(2, 2)},
      {position: new XY(1, -1), size: new WH(0, 2)},
      false,
      {position: new XY(-1, -1), size: new WH(4, 2)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(1, -2), size: new WH(2, 2)},
      {position: new XY(1, -1), size: new WH(0, 1)},
      false,
      {position: new XY(-1, -2), size: new WH(4, 3)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(1, -3), size: new WH(2, 2)},
      {position: new XY(1, -1), size: new WH(0, 0)},
      false,
      {position: new XY(-1, -3), size: new WH(4, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(0, -3), size: new WH(2, 2)},
      {position: new XY(0, -1), size: new WH(1, 0)},
      false,
      {position: new XY(-1, -3), size: new WH(3, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, -3), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(2, 0)},
      false,
      {position: new XY(-1, -3), size: new WH(2, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-2, -3), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(1, 0)},
      false,
      {position: new XY(-2, -3), size: new WH(3, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-3, -3), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(0, 0)},
      false,
      {position: new XY(-3, -3), size: new WH(4, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-3, -2), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(0, 1)},
      false,
      {position: new XY(-3, -2), size: new WH(4, 3)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-3, -1), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(0, 2)},
      false,
      {position: new XY(-3, -1), size: new WH(4, 2)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-3, 0), size: new WH(2, 2)},
      {position: new XY(-1, 0), size: new WH(0, 1)},
      false,
      {position: new XY(-3, -1), size: new WH(4, 3)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-3, 1), size: new WH(2, 2)},
      {position: new XY(-1, 1), size: new WH(0, 0)},
      false,
      {position: new XY(-3, -1), size: new WH(4, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-2, 1), size: new WH(2, 2)},
      {position: new XY(-1, 1), size: new WH(1, 0)},
      false,
      {position: new XY(-2, -1), size: new WH(3, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, 1), size: new WH(2, 2)},
      {position: new XY(-1, 1), size: new WH(2, 0)},
      false,
      {position: new XY(-1, -1), size: new WH(2, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(0, 1), size: new WH(2, 2)},
      {position: new XY(0, 1), size: new WH(1, 0)},
      false,
      {position: new XY(-1, -1), size: new WH(3, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(1, 1), size: new WH(2, 2)},
      {position: new XY(1, 1), size: new WH(0, 0)},
      false,
      {position: new XY(-1, -1), size: new WH(4, 4)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(1, 0), size: new WH(2, 2)},
      {position: new XY(1, 0), size: new WH(0, 1)},
      false,
      {position: new XY(-1, -1), size: new WH(4, 3)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(2, -1), size: new WH(2, 2)},
      {position: new XY(2, -1), size: new WH(-1, 2)},
      false,
      {position: new XY(-1, -1), size: new WH(5, 2)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(2, -2), size: new WH(2, 2)},
      {position: new XY(2, -1), size: new WH(-1, 1)},
      false,
      {position: new XY(-1, -2), size: new WH(5, 3)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(0, -4), size: new WH(2, 2)},
      {position: new XY(0, -1), size: new WH(1, -1)},
      false,
      {position: new XY(-1, -4), size: new WH(3, 5)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, -4), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(2, -1)},
      false,
      {position: new XY(-1, -4), size: new WH(2, 5)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-2, -4), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(1, -1)},
      false,
      {position: new XY(-2, -4), size: new WH(3, 5)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-4, -2), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(-1, 1)},
      false,
      {position: new XY(-4, -2), size: new WH(5, 3)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-4, -1), size: new WH(2, 2)},
      {position: new XY(-1, -1), size: new WH(-1, 2)},
      false,
      {position: new XY(-4, -1), size: new WH(5, 2)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-4, 0), size: new WH(2, 2)},
      {position: new XY(-1, 0), size: new WH(-1, 1)},
      false,
      {position: new XY(-4, -1), size: new WH(5, 3)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-2, 2), size: new WH(2, 2)},
      {position: new XY(-1, 2), size: new WH(1, -1)},
      false,
      {position: new XY(-2, -1), size: new WH(3, 5)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(-1, 2), size: new WH(2, 2)},
      {position: new XY(-1, 2), size: new WH(2, -1)},
      false,
      {position: new XY(-1, -1), size: new WH(2, 5)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(0, 2), size: new WH(2, 2)},
      {position: new XY(0, 2), size: new WH(1, -1)},
      false,
      {position: new XY(-1, -1), size: new WH(3, 5)}
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
      {position: new XY(-1, -1), size: new WH(2, 2)},
      {position: new XY(2, 0), size: new WH(2, 2)},
      {position: new XY(2, 0), size: new WH(-1, 1)},
      false,
      {position: new XY(-1, -1), size: new WH(5, 3)}
    ],
    [
      `0 Distant Disjoint`,
      {position: new XY(0, 0), size: new WH(10, 10)},
      {position: new XY(17, -22), size: new WH(8, 5)},
      {position: new XY(17, 0), size: new WH(-7, -17)},
      false,
      {position: new XY(0, -22), size: new WH(25, 32)}
    ],
    [
      `1 Distant Disjoint`,
      {position: new XY(0, 0), size: new WH(10, 10)},
      {position: new XY(-17, -22), size: new WH(8, 5)},
      {position: new XY(0, 0), size: new WH(-9, -17)},
      false,
      {position: new XY(-17, -22), size: new WH(27, 32)}
    ],
    [
      `2 Distant Disjoint`,
      {position: new XY(0, 0), size: new WH(10, 10)},
      {position: new XY(-17, 22), size: new WH(8, 5)},
      {position: new XY(0, 22), size: new WH(-9, -12)},
      false,
      {position: new XY(-17, 0), size: new WH(27, 27)}
    ],
    [
      `3 Distant Disjoint`,
      {position: new XY(0, 0), size: new WH(10, 10)},
      {position: new XY(17, 22), size: new WH(8, 5)},
      {position: new XY(17, 22), size: new WH(-7, -12)},
      false,
      {position: new XY(0, 0), size: new WH(25, 27)}
    ],
    [
      `0 Disparate Disjoint`,
      {position: new XY(100, 100), size: new WH(400, 1000)},
      {position: new XY(20, -39), size: new WH(12, 38)},
      {position: new XY(100, 100), size: new WH(-68, -101)},
      false,
      {position: new XY(20, -39), size: new WH(480, 1139)}
    ],
    [
      `1 Disparate Disjoint`,
      {position: new XY(100, 100), size: new WH(400, 1000)},
      {position: new XY(-20, -39), size: new WH(12, 38)},
      {position: new XY(100, 100), size: new WH(-108, -101)},
      false,
      {position: new XY(-20, -39), size: new WH(520, 1139)}
    ],
    [
      `2 Disparate Disjoint`,
      {position: new XY(100, 100), size: new WH(400, 1000)},
      {position: new XY(-20, 39), size: new WH(12, 38)},
      {position: new XY(100, 100), size: new WH(-108, -23)},
      false,
      {position: new XY(-20, 39), size: new WH(520, 1061)}
    ],
    [
      `3 Disparate Disjoint`,
      {position: new XY(100, 100), size: new WH(400, 1000)},
      {position: new XY(20, 39), size: new WH(12, 38)},
      {position: new XY(100, 100), size: new WH(-68, -23)},
      false,
      {position: new XY(20, 39), size: new WH(480, 1061)}
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
