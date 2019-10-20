import {ImageCompositionParser} from './ImageCompositionParser'
import {ImageComposition} from './ImageComposition'

describe('parse()', () => {
  test('number', () =>
    expect(ImageCompositionParser.parse(1)).toStrictEqual(
      ImageComposition.SOURCE_MASK
    ))

  test('string', () =>
    expect(ImageCompositionParser.parse(2)).toStrictEqual(
      ImageComposition.SOURCE_IN
    ))

  test('invalid number', () =>
    expect(() => ImageCompositionParser.parse(99)).toThrow())

  test('invalid string', () =>
    expect(() => ImageCompositionParser.parse('foo')).toThrow())
})
