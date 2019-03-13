import {MemFont} from './mem-font'
import {Text} from './text'

const rowHeight: number = MemFont.lineHeight + MemFont.leading

describe('layout()', () =>
  test.each(<ReadonlyArray<Readonly<[string, number, Text.Layout]>>>[
    ['', Number.MAX_VALUE, {positions: [], cursor: {x: 0, y: 0 * rowHeight}}],
    [
      ' ',
      Number.MAX_VALUE,
      {positions: [undefined], cursor: {x: 2, y: 0 * rowHeight}}
    ],
    [
      '\n',
      Number.MAX_VALUE,
      {positions: [undefined], cursor: {x: 0, y: 1 * rowHeight}}
    ],
    [
      'abc def ghi jkl mno',
      Number.MAX_VALUE,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 8, y: 0 * rowHeight},
          undefined,
          {x: 13, y: 0 * rowHeight},
          {x: 17, y: 0 * rowHeight},
          {x: 21, y: 0 * rowHeight},
          undefined,
          {x: 25, y: 1 + 0 * rowHeight},
          {x: 29, y: 0 * rowHeight},
          {x: 33, y: 0 * rowHeight},
          undefined,
          {x: 36, y: 1 + 0 * rowHeight},
          {x: 40, y: 0 * rowHeight},
          {x: 44, y: 0 * rowHeight},
          undefined,
          {x: 48, y: 0 * rowHeight},
          {x: 52, y: 0 * rowHeight},
          {x: 56, y: 0 * rowHeight}
        ],
        cursor: {x: 59, y: 0 * rowHeight}
      }
    ],

    [
      'abc def ghi jkl mno',
      10,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          undefined,
          {x: 5, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 4, y: 2 * rowHeight},
          undefined,
          {x: 0, y: 1 + 3 * rowHeight},
          {x: 4, y: 3 * rowHeight},
          {x: 8, y: 3 * rowHeight},
          undefined,
          {x: 0, y: 1 + 4 * rowHeight},
          {x: 4, y: 4 * rowHeight},
          {x: 8, y: 4 * rowHeight},
          undefined,
          {x: 0, y: 5 * rowHeight},
          {x: 4, y: 5 * rowHeight},
          {x: 0, y: 6 * rowHeight}
        ],
        cursor: {x: 3, y: 6 * rowHeight}
      }
    ],
    [
      'abc def ghi jkl mno',
      20,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 8, y: 0 * rowHeight},
          undefined,
          {x: 0, y: 1 * rowHeight},
          {x: 4, y: 1 * rowHeight},
          {x: 8, y: 1 * rowHeight},
          undefined,
          {x: 0, y: 1 + 2 * rowHeight},
          {x: 4, y: 2 * rowHeight},
          {x: 8, y: 2 * rowHeight},
          undefined,
          {x: 0, y: 1 + 3 * rowHeight},
          {x: 4, y: 3 * rowHeight},
          {x: 8, y: 3 * rowHeight},
          undefined,
          {x: 0, y: 4 * rowHeight},
          {x: 4, y: 4 * rowHeight},
          {x: 8, y: 4 * rowHeight}
        ],
        cursor: {x: 11, y: 4 * rowHeight}
      }
    ],
    [
      'abc def ghi jkl mno',
      21,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 8, y: 0 * rowHeight},
          undefined,
          {x: 0, y: 1 * rowHeight},
          {x: 4, y: 1 * rowHeight},
          {x: 8, y: 1 * rowHeight},
          undefined,
          {x: 12, y: 1 + 1 * rowHeight},
          {x: 16, y: 1 * rowHeight},
          {x: 20, y: 1 * rowHeight},
          undefined,
          {x: 0, y: 1 + 2 * rowHeight},
          {x: 4, y: 2 * rowHeight},
          {x: 8, y: 2 * rowHeight},
          undefined,
          {x: 0, y: 3 * rowHeight},
          {x: 4, y: 3 * rowHeight},
          {x: 8, y: 3 * rowHeight}
        ],
        cursor: {x: 11, y: 3 * rowHeight}
      }
    ],

    [
      'a  b',
      4,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          undefined,
          undefined,
          {x: 0, y: 2 * rowHeight}
        ],
        cursor: {x: 3, y: 2 * rowHeight}
      }
    ],
    [
      'a  b ',
      4,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          undefined,
          undefined,
          {x: 0, y: 2 * rowHeight},
          undefined
        ],
        cursor: {x: 0, y: 3 * rowHeight}
      }
    ]
  ])('%#) %p %p => %p', (string, width, expected) =>
    expect(
      Text.layout(string, width, {x: 1, y: 1 + 0 * rowHeight})
    ).toStrictEqual(expected)
  ))

describe('layoutWord()', () =>
  test.each(<
    ReadonlyArray<Readonly<[XY, number, string, number, Text.Layout]>>
  >[
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      ' ',
      0,
      {positions: [], cursor: {x: 0, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      '',
      0,
      {positions: [], cursor: {x: 0, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      '\n',
      0,
      {positions: [], cursor: {x: 0, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'a',
      0,
      {positions: [{x: 0, y: 0 * rowHeight}], cursor: {x: 3, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      '.',
      0,
      {positions: [{x: 0, y: 0 * rowHeight}], cursor: {x: 1, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'a ',
      0,
      {positions: [{x: 0, y: 0 * rowHeight}], cursor: {x: 3, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'a\n',
      0,
      {positions: [{x: 0, y: 0 * rowHeight}], cursor: {x: 3, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'a a',
      0,
      {positions: [{x: 0, y: 0 * rowHeight}], cursor: {x: 3, y: 0 * rowHeight}}
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'a.',
      0,
      {
        positions: [{x: 0, y: 0 * rowHeight}, {x: 4, y: 0 * rowHeight}],
        cursor: {x: 5, y: 0 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'aa',
      0,
      {
        positions: [{x: 0, y: 0 * rowHeight}, {x: 4, y: 0 * rowHeight}],
        cursor: {x: 7, y: 0 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'aa\n',
      0,
      {
        positions: [{x: 0, y: 0 * rowHeight}, {x: 4, y: 0 * rowHeight}],
        cursor: {x: 7, y: 0 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'aa aa',
      0,
      {
        positions: [{x: 0, y: 0 * rowHeight}, {x: 4, y: 0 * rowHeight}],
        cursor: {x: 7, y: 0 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'g',
      0,
      {
        positions: [{x: 0, y: 1 + 0 * rowHeight}],
        cursor: {x: 3, y: 0 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 8, y: 0 * rowHeight},
          {x: 12, y: 0 * rowHeight},
          {x: 16, y: 0 * rowHeight},
          {x: 20, y: 0 * rowHeight},
          {x: 23, y: 1 + 0 * rowHeight},
          {x: 27, y: 0 * rowHeight}
        ],
        cursor: {x: 30, y: 0 * rowHeight}
      }
    ],

    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'abcdefgh',
      1,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 8, y: 0 * rowHeight},
          {x: 12, y: 0 * rowHeight},
          {x: 16, y: 0 * rowHeight},
          {x: 19, y: 1 + 0 * rowHeight},
          {x: 23, y: 0 * rowHeight}
        ],
        cursor: {x: 26, y: 0 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      Number.MAX_VALUE,
      'abcdefgh',
      8,
      {positions: [], cursor: {x: 0, y: 0 * rowHeight}}
    ],

    [
      {x: 0, y: 0 * rowHeight},
      0,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 0, y: 5 * rowHeight},
          {x: 0, y: 1 + 6 * rowHeight},
          {x: 0, y: 7 * rowHeight}
        ],
        cursor: {x: 3, y: 7 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      1,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 0, y: 5 * rowHeight},
          {x: 0, y: 1 + 6 * rowHeight},
          {x: 0, y: 7 * rowHeight}
        ],
        cursor: {x: 3, y: 7 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      3,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 0, y: 5 * rowHeight},
          {x: 0, y: 1 + 6 * rowHeight},
          {x: 0, y: 7 * rowHeight}
        ],
        cursor: {x: 3, y: 7 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 0, y: 5 * rowHeight},
          {x: 0, y: 1 + 6 * rowHeight},
          {x: 0, y: 7 * rowHeight}
        ],
        cursor: {x: 3, y: 7 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      6,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 0, y: 5 * rowHeight},
          {x: 0, y: 1 + 6 * rowHeight},
          {x: 0, y: 7 * rowHeight}
        ],
        cursor: {x: 3, y: 7 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      7,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 4, y: 4 * rowHeight},
          {x: 0, y: 1 + 5 * rowHeight},
          {x: 4, y: 5 * rowHeight}
        ],
        cursor: {x: 7, y: 5 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      8,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 4, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 4, y: 2 * rowHeight},
          {x: 0, y: 1 + 3 * rowHeight},
          {x: 4, y: 3 * rowHeight}
        ],
        cursor: {x: 7, y: 3 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      9,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 4, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 4, y: 2 * rowHeight},
          {x: 0, y: 1 + 3 * rowHeight},
          {x: 4, y: 3 * rowHeight}
        ],
        cursor: {x: 7, y: 3 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      10,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 4, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 4, y: 2 * rowHeight},
          {x: 0, y: 1 + 3 * rowHeight},
          {x: 4, y: 3 * rowHeight}
        ],
        cursor: {x: 7, y: 3 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      11,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 4, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 4, y: 2 * rowHeight},
          {x: 7, y: 1 + 2 * rowHeight},
          {x: 0, y: 3 * rowHeight}
        ],
        cursor: {x: 3, y: 3 * rowHeight}
      }
    ],
    [
      {x: 0, y: 0 * rowHeight},
      12,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * rowHeight},
          {x: 4, y: 0 * rowHeight},
          {x: 8, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 4, y: 1 * rowHeight},
          {x: 8, y: 1 * rowHeight},
          {x: 0, y: 1 + 2 * rowHeight},
          {x: 4, y: 2 * rowHeight}
        ],
        cursor: {x: 7, y: 2 * rowHeight}
      }
    ],

    [
      {x: 1, y: 0 * rowHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 1, y: 0 * rowHeight},
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 0, y: 5 * rowHeight},
          {x: 0, y: 1 + 6 * rowHeight},
          {x: 0, y: 7 * rowHeight}
        ],
        cursor: {x: 3, y: 7 * rowHeight}
      }
    ],
    [
      {x: 2, y: 0 * rowHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 1 * rowHeight},
          {x: 0, y: 2 * rowHeight},
          {x: 0, y: 3 * rowHeight},
          {x: 0, y: 4 * rowHeight},
          {x: 0, y: 5 * rowHeight},
          {x: 0, y: 6 * rowHeight},
          {x: 0, y: 1 + 7 * rowHeight},
          {x: 0, y: 8 * rowHeight}
        ],
        cursor: {x: 3, y: 8 * rowHeight}
      }
    ],

    [
      {x: 2, y: 1 + 0 * rowHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 1 + 1 * rowHeight},
          {x: 0, y: 1 + 2 * rowHeight},
          {x: 0, y: 1 + 3 * rowHeight},
          {x: 0, y: 1 + 4 * rowHeight},
          {x: 0, y: 1 + 5 * rowHeight},
          {x: 0, y: 1 + 6 * rowHeight},
          {x: 0, y: 1 + 1 + 7 * rowHeight},
          {x: 0, y: 1 + 8 * rowHeight}
        ],
        cursor: {x: 3, y: 1 + 8 * rowHeight}
      }
    ]
  ])('%#) %p %p %p %p => %p', (cursor, width, string, index, expected) =>
    expect(
      Text.layoutWord(cursor, width, string, index, {
        x: 1,
        y: 1 + 0 * rowHeight
      })
    ).toStrictEqual(expected)
  ))
