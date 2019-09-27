import {lineHeight} from './memFont.json'
import {TextLayout} from './TextLayout'
import {XY} from '../math/XY'

describe('layout()', () =>
  test.each(<readonly [string, number, TextLayout][]>[
    ['', Number.MAX_VALUE, {positions: [], cursor: new XY(0, 0 * lineHeight)}],
    [
      ' ',
      Number.MAX_VALUE,
      {positions: [undefined], cursor: new XY(3, 0 * lineHeight)}
    ],
    [
      '\n',
      Number.MAX_VALUE,
      {positions: [undefined], cursor: new XY(0, 1 * lineHeight)}
    ],
    [
      'abc def ghi jkl mno',
      Number.MAX_VALUE,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(8, 0 * lineHeight),
          undefined,
          new XY(14, 0 * lineHeight),
          new XY(18, 0 * lineHeight),
          new XY(22, 0 * lineHeight),
          undefined,
          new XY(27, 0 * lineHeight),
          new XY(31, 0 * lineHeight),
          new XY(35, 0 * lineHeight),
          undefined,
          new XY(39, 0 * lineHeight),
          new XY(43, 0 * lineHeight),
          new XY(47, 0 * lineHeight),
          undefined,
          new XY(51, 0 * lineHeight),
          new XY(55, 0 * lineHeight),
          new XY(59, 0 * lineHeight)
        ],
        cursor: new XY(62, 0 * lineHeight)
      }
    ],

    [
      'abc def ghi jkl mno',
      10,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          undefined,
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight),
          new XY(8, 2 * lineHeight),
          undefined,
          new XY(0, 3 * lineHeight),
          new XY(4, 3 * lineHeight),
          new XY(8, 3 * lineHeight),
          undefined,
          new XY(0, 4 * lineHeight),
          new XY(4, 4 * lineHeight),
          new XY(8, 4 * lineHeight),
          undefined,
          new XY(0, 5 * lineHeight),
          new XY(4, 5 * lineHeight),
          new XY(0, 6 * lineHeight)
        ],
        cursor: new XY(3, 6 * lineHeight)
      }
    ],
    [
      'abc def ghi jkl mno',
      20,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(8, 0 * lineHeight),
          undefined,
          new XY(0, 1 * lineHeight),
          new XY(4, 1 * lineHeight),
          new XY(8, 1 * lineHeight),
          undefined,
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight),
          new XY(8, 2 * lineHeight),
          undefined,
          new XY(0, 3 * lineHeight),
          new XY(4, 3 * lineHeight),
          new XY(8, 3 * lineHeight),
          undefined,
          new XY(0, 4 * lineHeight),
          new XY(4, 4 * lineHeight),
          new XY(8, 4 * lineHeight)
        ],
        cursor: new XY(11, 4 * lineHeight)
      }
    ],
    [
      'abc def ghi jkl mno',
      21,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(8, 0 * lineHeight),
          undefined,
          new XY(0, 1 * lineHeight),
          new XY(4, 1 * lineHeight),
          new XY(8, 1 * lineHeight),
          undefined,
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight),
          new XY(8, 2 * lineHeight),
          undefined,
          new XY(12, 2 * lineHeight),
          new XY(16, 2 * lineHeight),
          new XY(20, 2 * lineHeight),
          undefined,
          new XY(0, 3 * lineHeight),
          new XY(4, 3 * lineHeight),
          new XY(8, 3 * lineHeight)
        ],
        cursor: new XY(11, 3 * lineHeight)
      }
    ],

    [
      'a  b',
      4,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          undefined,
          undefined,
          new XY(0, 2 * lineHeight)
        ],
        cursor: new XY(3, 2 * lineHeight)
      }
    ],
    [
      'a  b ',
      4,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          undefined,
          undefined,
          new XY(0, 2 * lineHeight),
          undefined
        ],
        cursor: new XY(0, 3 * lineHeight)
      }
    ]
  ])('%#) %p %p => %p', (string, width, expected) =>
    expect(
      TextLayout.layout(string, width, new XY(1, 1 + 0 * lineHeight))
    ).toStrictEqual(expected)
  ))

describe('layoutWord()', () =>
  test.each(<readonly [XY, number, string, number, TextLayout][]>[
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      ' ',
      0,
      {positions: [], cursor: new XY(0, 0 * lineHeight)}
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      '',
      0,
      {positions: [], cursor: new XY(0, 0 * lineHeight)}
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      '\n',
      0,
      {positions: [], cursor: new XY(0, 0 * lineHeight)}
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'a',
      0,
      {
        positions: [new XY(0, 0 * lineHeight)],
        cursor: new XY(3, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      '.',
      0,
      {
        positions: [new XY(0, 0 * lineHeight)],
        cursor: new XY(1, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'a ',
      0,
      {
        positions: [new XY(0, 0 * lineHeight)],
        cursor: new XY(3, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'a\n',
      0,
      {
        positions: [new XY(0, 0 * lineHeight)],
        cursor: new XY(3, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'a a',
      0,
      {
        positions: [new XY(0, 0 * lineHeight)],
        cursor: new XY(3, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'a.',
      0,
      {
        positions: [new XY(0, 0 * lineHeight), new XY(4, 0 * lineHeight)],
        cursor: new XY(5, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'aa',
      0,
      {
        positions: [new XY(0, 0 * lineHeight), new XY(4, 0 * lineHeight)],
        cursor: new XY(7, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'aa\n',
      0,
      {
        positions: [new XY(0, 0 * lineHeight), new XY(4, 0 * lineHeight)],
        cursor: new XY(7, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'aa aa',
      0,
      {
        positions: [new XY(0, 0 * lineHeight), new XY(4, 0 * lineHeight)],
        cursor: new XY(7, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'g',
      0,
      {
        positions: [new XY(0, 0 * lineHeight)],
        cursor: new XY(3, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(8, 0 * lineHeight),
          new XY(12, 0 * lineHeight),
          new XY(16, 0 * lineHeight),
          new XY(20, 0 * lineHeight),
          new XY(23, 0 * lineHeight),
          new XY(27, 0 * lineHeight)
        ],
        cursor: new XY(30, 0 * lineHeight)
      }
    ],

    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'abcdefgh',
      1,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(8, 0 * lineHeight),
          new XY(12, 0 * lineHeight),
          new XY(16, 0 * lineHeight),
          new XY(19, 0 * lineHeight),
          new XY(23, 0 * lineHeight)
        ],
        cursor: new XY(26, 0 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      Number.MAX_VALUE,
      'abcdefgh',
      8,
      {positions: [], cursor: new XY(0, 0 * lineHeight)}
    ],

    [
      new XY(0, 0 * lineHeight),
      0,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(0, 6 * lineHeight),
          new XY(0, 7 * lineHeight)
        ],
        cursor: new XY(3, 7 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      1,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(0, 6 * lineHeight),
          new XY(0, 7 * lineHeight)
        ],
        cursor: new XY(3, 7 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      3,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(0, 6 * lineHeight),
          new XY(0, 7 * lineHeight)
        ],
        cursor: new XY(3, 7 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      5,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(0, 6 * lineHeight),
          new XY(0, 7 * lineHeight)
        ],
        cursor: new XY(3, 7 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      6,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(0, 6 * lineHeight),
          new XY(0, 7 * lineHeight)
        ],
        cursor: new XY(3, 7 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      7,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(4, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(4, 5 * lineHeight)
        ],
        cursor: new XY(7, 5 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      8,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(4, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(4, 3 * lineHeight)
        ],
        cursor: new XY(7, 3 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      9,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(4, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(4, 3 * lineHeight)
        ],
        cursor: new XY(7, 3 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      10,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(4, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(4, 3 * lineHeight)
        ],
        cursor: new XY(7, 3 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      11,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(4, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight),
          new XY(7, 2 * lineHeight),
          new XY(0, 3 * lineHeight)
        ],
        cursor: new XY(3, 3 * lineHeight)
      }
    ],
    [
      new XY(0, 0 * lineHeight),
      12,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 0 * lineHeight),
          new XY(4, 0 * lineHeight),
          new XY(8, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(4, 1 * lineHeight),
          new XY(8, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(4, 2 * lineHeight)
        ],
        cursor: new XY(7, 2 * lineHeight)
      }
    ],

    [
      new XY(1, 0 * lineHeight),
      5,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(1, 0 * lineHeight),
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(0, 6 * lineHeight),
          new XY(0, 7 * lineHeight)
        ],
        cursor: new XY(3, 7 * lineHeight)
      }
    ],
    [
      new XY(2, 0 * lineHeight),
      5,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 1 * lineHeight),
          new XY(0, 2 * lineHeight),
          new XY(0, 3 * lineHeight),
          new XY(0, 4 * lineHeight),
          new XY(0, 5 * lineHeight),
          new XY(0, 6 * lineHeight),
          new XY(0, 7 * lineHeight),
          new XY(0, 8 * lineHeight)
        ],
        cursor: new XY(3, 8 * lineHeight)
      }
    ],

    [
      new XY(2, 1 + 0 * lineHeight),
      5,
      'abcdefgh',
      0,
      {
        positions: [
          new XY(0, 1 + 1 * lineHeight),
          new XY(0, 1 + 2 * lineHeight),
          new XY(0, 1 + 3 * lineHeight),
          new XY(0, 1 + 4 * lineHeight),
          new XY(0, 1 + 5 * lineHeight),
          new XY(0, 1 + 6 * lineHeight),
          new XY(0, 1 + 7 * lineHeight),
          new XY(0, 1 + 8 * lineHeight)
        ],
        cursor: new XY(3, 1 + 8 * lineHeight)
      }
    ]
  ])('%#) %p %p %p %p => %p', (cursor, width, string, index, expected) =>
    expect(
      TextLayout.layoutWord(
        cursor,
        width,
        string,
        index,
        new XY(1, 1 + 0 * lineHeight)
      )
    ).toStrictEqual(expected)
  ))
