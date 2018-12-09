import * as text from './text'

describe('layout()', () =>
  test.each([
    ['', Number.MAX_VALUE, {positions: [], cursor: {x: 0, y: 0}}],
    [' ', Number.MAX_VALUE, {positions: [undefined], cursor: {x: 1, y: 0}}],
    ['\n', Number.MAX_VALUE, {positions: [undefined], cursor: {x: 0, y: 5}}],
    [
      'abc def ghi jkl mno',
      Number.MAX_VALUE,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 8, y: 0},
          undefined,
          {x: 12, y: 0},
          {x: 16, y: 0},
          {x: 20, y: 0},
          undefined,
          {x: 23, y: 1},
          {x: 27, y: 0},
          {x: 31, y: 0},
          undefined,
          {x: 33, y: 1},
          {x: 37, y: 0},
          {x: 41, y: 0},
          undefined,
          {x: 44, y: 0},
          {x: 48, y: 0},
          {x: 52, y: 0}
        ],
        cursor: {x: 55, y: 0}
      }
    ],

    [
      'abc def ghi jkl mno',
      10,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 0, y: 5},
          undefined,
          {x: 4, y: 5},
          {x: 0, y: 10},
          {x: 4, y: 10},
          undefined,
          {x: 0, y: 16},
          {x: 4, y: 15},
          {x: 8, y: 15},
          undefined,
          {x: 0, y: 21},
          {x: 4, y: 20},
          {x: 8, y: 20},
          undefined,
          {x: 0, y: 25},
          {x: 4, y: 25},
          {x: 0, y: 30}
        ],
        cursor: {x: 3, y: 30}
      }
    ],

    [
      'a  b',
      4,
      {
        positions: [{x: 0, y: 0}, undefined, undefined, {x: 1, y: 5}],
        cursor: {x: 4, y: 5}
      }
    ],
    [
      'a  b ',
      4,
      {
        positions: [
          {x: 0, y: 0},
          undefined,
          undefined,
          {x: 1, y: 5},
          undefined
        ],
        cursor: {x: 0, y: 10}
      }
    ]
  ])('%#) %p %p => %p', (
    /** @type {string} */ string,
    /** @type {number} */ width,
    /** @type {number} */ expected
  ) => expect(text.layout(string, width)).toStrictEqual(expected)))

describe('layoutWord()', () =>
  test.each([
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      ' ',
      0,
      {positions: [], cursor: {x: 0, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      '',
      0,
      {positions: [], cursor: {x: 0, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      '\n',
      0,
      {positions: [], cursor: {x: 0, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'a',
      0,
      {positions: [{x: 0, y: 0}], cursor: {x: 3, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      '.',
      0,
      {positions: [{x: 0, y: 0}], cursor: {x: 1, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'a ',
      0,
      {positions: [{x: 0, y: 0}], cursor: {x: 3, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'a\n',
      0,
      {positions: [{x: 0, y: 0}], cursor: {x: 3, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'a a',
      0,
      {positions: [{x: 0, y: 0}], cursor: {x: 3, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'a.',
      0,
      {positions: [{x: 0, y: 0}, {x: 4, y: 0}], cursor: {x: 5, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'aa',
      0,
      {positions: [{x: 0, y: 0}, {x: 4, y: 0}], cursor: {x: 7, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'aa\n',
      0,
      {positions: [{x: 0, y: 0}, {x: 4, y: 0}], cursor: {x: 7, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'aa aa',
      0,
      {positions: [{x: 0, y: 0}, {x: 4, y: 0}], cursor: {x: 7, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'g',
      0,
      {positions: [{x: 0, y: 1}], cursor: {x: 3, y: 0}}
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 8, y: 0},
          {x: 12, y: 0},
          {x: 16, y: 0},
          {x: 20, y: 0},
          {x: 23, y: 1},
          {x: 27, y: 0}
        ],
        cursor: {x: 30, y: 0}
      }
    ],

    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'abcdefgh',
      1,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 8, y: 0},
          {x: 12, y: 0},
          {x: 16, y: 0},
          {x: 19, y: 1},
          {x: 23, y: 0}
        ],
        cursor: {x: 26, y: 0}
      }
    ],
    [
      {x: 0, y: 0},
      Number.MAX_VALUE,
      'abcdefgh',
      8,
      {positions: [], cursor: {x: 0, y: 0}}
    ],

    [
      {x: 0, y: 0},
      0,
      'abcdefgh',
      0,
      {
        positions: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        ],
        cursor: {x: 3, y: 35}
      }
    ],
    [
      {x: 0, y: 0},
      1,
      'abcdefgh',
      0,
      {
        positions: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        ],
        cursor: {x: 3, y: 35}
      }
    ],
    [
      {x: 0, y: 0},
      3,
      'abcdefgh',
      0,
      {
        positions: [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        ],
        cursor: {x: 3, y: 35}
      }
    ],
    [
      {x: 0, y: 0},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 0, y: 5},
          {x: 0, y: 10},
          {x: 0, y: 15},
          {x: 0, y: 20},
          {x: 0, y: 25},
          {x: 0, y: 31},
          {x: 0, y: 35}
        ],
        cursor: {x: 3, y: 35}
      }
    ],
    [
      {x: 0, y: 0},
      6,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 0, y: 5},
          {x: 0, y: 10},
          {x: 0, y: 15},
          {x: 0, y: 20},
          {x: 0, y: 25},
          {x: 0, y: 31},
          {x: 0, y: 35}
        ],
        cursor: {x: 3, y: 35}
      }
    ],
    [
      {x: 0, y: 0},
      7,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 0, y: 5},
          {x: 0, y: 10},
          {x: 0, y: 15},
          {x: 0, y: 20},
          {x: 4, y: 20},
          {x: 0, y: 26},
          {x: 4, y: 25}
        ],
        cursor: {x: 7, y: 25}
      }
    ],
    [
      {x: 0, y: 0},
      8,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 0, y: 5},
          {x: 4, y: 5},
          {x: 0, y: 10},
          {x: 4, y: 10},
          {x: 0, y: 16},
          {x: 4, y: 15}
        ],
        cursor: {x: 7, y: 15}
      }
    ],
    [
      {x: 0, y: 0},
      9,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 0, y: 5},
          {x: 4, y: 5},
          {x: 0, y: 10},
          {x: 4, y: 10},
          {x: 0, y: 16},
          {x: 4, y: 15}
        ],
        cursor: {x: 7, y: 15}
      }
    ],
    [
      {x: 0, y: 0},
      10,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 0, y: 5},
          {x: 4, y: 5},
          {x: 0, y: 10},
          {x: 4, y: 10},
          {x: 0, y: 16},
          {x: 4, y: 15}
        ],
        cursor: {x: 7, y: 15}
      }
    ],
    [
      {x: 0, y: 0},
      11,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 0, y: 5},
          {x: 4, y: 5},
          {x: 0, y: 10},
          {x: 4, y: 10},
          {x: 7, y: 11},
          {x: 0, y: 15}
        ],
        cursor: {x: 3, y: 15}
      }
    ],
    [
      {x: 0, y: 0},
      12,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0},
          {x: 4, y: 0},
          {x: 8, y: 0},
          {x: 0, y: 5},
          {x: 4, y: 5},
          {x: 8, y: 5},
          {x: 0, y: 11},
          {x: 4, y: 10}
        ],
        cursor: {x: 7, y: 10}
      }
    ],

    [
      {x: 1, y: 0},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 1, y: 0},
          {x: 0, y: 5},
          {x: 0, y: 10},
          {x: 0, y: 15},
          {x: 0, y: 20},
          {x: 0, y: 25},
          {x: 0, y: 31},
          {x: 0, y: 35}
        ],
        cursor: {x: 3, y: 35}
      }
    ],
    [
      {x: 2, y: 0},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 5},
          {x: 0, y: 10},
          {x: 0, y: 15},
          {x: 0, y: 20},
          {x: 0, y: 25},
          {x: 0, y: 30},
          {x: 0, y: 36},
          {x: 0, y: 40}
        ],
        cursor: {x: 3, y: 40}
      }
    ],

    [
      {x: 2, y: 1},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 6},
          {x: 0, y: 11},
          {x: 0, y: 16},
          {x: 0, y: 21},
          {x: 0, y: 26},
          {x: 0, y: 31},
          {x: 0, y: 37},
          {x: 0, y: 41}
        ],
        cursor: {x: 3, y: 41}
      }
    ]
  ])('%#) %p %p %p %p => %p', (
    /** @type {XY} */ cursor,
    /** @type {number} */ width,
    /** @type {string} */ string,
    /** @type {number} */ index,
    /** @type {number} */ expected
  ) =>
    expect(text.layoutWord(cursor, width, string, index)).toStrictEqual(
      expected
    )
  ))
