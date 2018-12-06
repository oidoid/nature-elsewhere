import * as text from './text'

describe('measureWord()', () => {
  test.each([
    ['a', 3],
    ['.', 1],
    [' ', 0],
    ['\n', 0],
    ['a ', 3],
    ['a\n', 3],
    ['a a', 3],
    ['a.', 5],
    ['aa', 7],
    ['aa\n', 7],
    ['aa aa', 7]
  ])('%#) %p => %p', (
    /** @type {string} */ string,
    /** @type {number} */ expected
  ) => expect(text.measureWord(string)).toStrictEqual(expected))
})
