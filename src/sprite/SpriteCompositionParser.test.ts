import {SpriteCompositionParser} from './SpriteCompositionParser'
import {SpriteComposition} from './SpriteComposition'

describe('parse()', () => {
  test('number', () =>
    expect(SpriteCompositionParser.parse(1)).toStrictEqual(
      SpriteComposition.SOURCE_MASK
    ))

  test('string', () =>
    expect(SpriteCompositionParser.parse(2)).toStrictEqual(
      SpriteComposition.SOURCE_IN
    ))

  test('invalid number', () =>
    expect(() => SpriteCompositionParser.parse(99)).toThrow())

  test('invalid string', () =>
    expect(() => SpriteCompositionParser.parse('foo')).toThrow())
})
