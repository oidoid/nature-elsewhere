import {AlphaCompositionParser} from './AlphaCompositionParser'
import {AlphaComposition} from './AlphaComposition'

describe('parse()', () => {
  test('number', () =>
    expect(AlphaCompositionParser.parse(1)).toStrictEqual(
      AlphaComposition.SOURCE_MASK
    ))

  test('string', () =>
    expect(AlphaCompositionParser.parse(2)).toStrictEqual(AlphaComposition.AND))

  test('invalid number', () =>
    expect(() => AlphaCompositionParser.parse(99)).toThrow())

  test('invalid string', () =>
    expect(() => AlphaCompositionParser.parse('foo')).toThrow())
})
