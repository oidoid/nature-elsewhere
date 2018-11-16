import * as aseprite from './aseprite.js'
import * as asepriteParser from './aseprite-parser.js'
import * as input from './aseprite-parser.input.test.json'
import * as util from '../util.js'
import atlasJSON from '../assets/atlas.js'
import expected from './aseprite-parser.expect.test.js'

/** @typedef {import('../drawables/atlas').Cel} Cel */

describe('atlas.json', () => {
  const file = atlasJSON
  const atlas = asepriteParser.parse(file)
  const tags = file.meta.frameTags.map(frameTag => frameTag.name)

  test('Converts current JSON and size is a reasonable power of two', () => {
    expect(atlas.size.w).toBeLessThanOrEqual(4096)
    expect(atlas.size.h).toBeLessThanOrEqual(4096)
    expect(Math.log2(atlas.size.w) % 1).toStrictEqual(0)
    expect(Math.log2(atlas.size.h) % 1).toStrictEqual(0)
  })

  test.each(tags)('%# Tag %p is unique within the sheet', (
    /** @type {string} */ tag
  ) => {
    expect(tags.filter(val => val === tag)).toHaveLength(1)
  })

  test.each(tags)('%# Tag %p has a Frame', (/** @type {string} */ tag) => {
    const frameKeys = util
      .keys(file.frames)
      .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
      .filter(util.uniq(Object.is))
    expect(frameKeys).toContainEqual(tag)
  })

  {
    const frameKeys = util
      .keys(file.frames)
      .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
      .filter(util.uniq(Object.is))
    test.each(frameKeys)('%# Frame has a Tag %p', (
      /** @type {string} */ frameKey
    ) => {
      expect(tags).toContainEqual(frameKey)
    })
  }

  test.each(file.meta.slices)('%# Slice name %p is a Tag', (
    /** @type {aseprite.Slice} */ slice
  ) => expect(tags).toContainEqual(slice.name))

  const cels = util
    .values(atlas.animations)
    .reduce((sum, val) => sum.concat(val.cels), /** @type {Cel[]} */ ([]))
  test.each(cels)('%# duration for Cel %p is > 0', (/** @type {Cel} */ cel) =>
    expect(cel.duration).toBeGreaterThan(0)
  )
})

describe('parse()', () => {
  test('Converts.', () => {
    expect(asepriteParser.parse(input)).toStrictEqual(expected)
  })
})

describe('parseAnimations()', () => {
  test('Converts Animations.', () => {
    /** ReadonlyArray<aseprite.FrameTag> */ const frameTags = [
      {name: 'cactus s', from: 0, to: 0, direction: 'forward'},
      {name: 'cactus m', from: 1, to: 1, direction: 'forward'},
      {name: 'cactus l', from: 2, to: 2, direction: 'forward'},
      {name: 'cactus xl', from: 3, to: 3, direction: 'forward'}
    ]
    const frames = {
      'cactus s 0': {
        frame: {x: 220, y: 18, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'cactus m 1': {
        frame: {x: 90, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'cactus l 2': {
        frame: {x: 72, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'cactus xl 3': {
        frame: {x: 54, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      }
    }
    const slices = [
      {
        name: 'cactus s',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 8, y: 12, w: 2, h: 3}}]
      },
      {
        name: 'cactus m',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 7, y: 11, w: 3, h: 4}}]
      },
      {
        name: 'cactus l',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 7, y: 10, w: 3, h: 5}}]
      },
      {
        name: 'cactus xl',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 7, y: 9, w: 3, h: 6}}]
      }
    ]
    expect(
      asepriteParser.parseAnimations(frameTags, frames, slices)
    ).toStrictEqual({
      'cactus s': {
        cels: [
          {
            bounds: {x: 221, y: 19, w: 16, h: 16},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 8, y: 12, w: 2, h: 3}]
          }
        ],
        direction: 'forward'
      },
      'cactus m': {
        cels: [
          {
            bounds: {x: 91, y: 55, w: 16, h: 16},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 7, y: 11, w: 3, h: 4}]
          }
        ],
        direction: 'forward'
      },
      'cactus l': {
        cels: [
          {
            bounds: {x: 73, y: 55, w: 16, h: 16},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 7, y: 10, w: 3, h: 5}]
          }
        ],
        direction: 'forward'
      },
      'cactus xl': {
        cels: [
          {
            bounds: {x: 55, y: 55, w: 16, h: 16},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 7, y: 9, w: 3, h: 6}]
          }
        ],
        direction: 'forward'
      }
    })
  })
})

describe('parseAnimation()', () => {
  test('Converts FrameTag, Frame from Frame[], and Slice.', () => {
    const frameTag = {name: 'cloud s', from: 1, to: 1, direction: 'forward'}
    const frames = {
      'cloud xs 0': {
        frame: {x: 202, y: 36, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'cloud s 1': {
        frame: {x: 184, y: 36, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'cloud m 2': {
        frame: {x: 166, y: 36, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      }
    }
    const slices = [
      {
        name: 'cloud xs',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 4, y: 12, w: 7, h: 3}}]
      },
      {
        name: 'cloud s',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 4, y: 11, w: 9, h: 4}}]
      },
      {
        name: 'cloud m',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 3, y: 11, w: 10, h: 4}}]
      }
    ]
    expect(
      asepriteParser.parseAnimation(frameTag, frames, slices)
    ).toStrictEqual({
      cels: [
        {
          bounds: {x: 185, y: 37, w: 16, h: 16},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 4, y: 11, w: 9, h: 4}]
        }
      ],
      direction: 'forward'
    })
  })
})

describe('marshalTagFrameNumber()', () => {
  test('Converts Tag and Frame number.', () => {
    expect(asepriteParser.marshalTagFrameNumber('stem ', 0)).toStrictEqual(
      'stem  0'
    )
  })

  test('Converts Tag.', () => {
    expect(asepriteParser.marshalTagFrameNumber('stem ')).toStrictEqual(
      'stem  '
    )
  })
})

describe('parseCel()', () => {
  test('Converts 1:1 texture mapping.', () => {
    const frameTag = {name: 'stem ', from: 0, to: 0, direction: 'forward'}
    const frame = {
      frame: {x: 130, y: 18, w: 18, h: 18},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
      sourceSize: {w: 16, h: 16},
      duration: 65535
    }
    const slices = [
      {
        name: 'stem ',
        color: '#0000ffff',
        keys: [{frame: 0, bounds: {x: 4, y: 4, w: 8, h: 12}}]
      }
    ]
    expect(asepriteParser.parseCel(frameTag, frame, 0, slices)).toStrictEqual({
      bounds: {x: 131, y: 19, w: 16, h: 16},
      duration: Number.POSITIVE_INFINITY,
      collision: [{x: 4, y: 4, w: 8, h: 12}]
    })
  })
})

describe('parseTexture()', () => {
  test('Converts 1:1 texture mapping.', () => {
    const frame = {
      frame: {x: 1, y: 2, w: 3, h: 4},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
      sourceSize: {w: 3, h: 4},
      duration: 1
    }
    expect(asepriteParser.parseTexture(frame)).toStrictEqual({
      x: 1,
      y: 2,
      w: 3,
      h: 4
    })
  })

  test('Converts texture mapping with padding.', () => {
    const frame = {
      frame: {x: 1, y: 2, w: 5, h: 6},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
      sourceSize: {w: 3, h: 4},
      duration: 1
    }
    expect(asepriteParser.parseTexture(frame)).toStrictEqual({
      x: 2,
      y: 3,
      w: 3,
      h: 4
    })
  })
})

describe('parsePadding()', () => {
  test('Converts zero padding.', () => {
    const frame = {
      frame: {x: 1, y: 2, w: 3, h: 4},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
      sourceSize: {w: 3, h: 4},
      duration: 1
    }
    expect(asepriteParser.parsePadding(frame)).toStrictEqual({w: 0, h: 0})
  })

  test('Converts nonzero padding.', () => {
    const frame = {
      frame: {x: 1, y: 2, w: 4, h: 5},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
      sourceSize: {w: 3, h: 4},
      duration: 1
    }
    expect(asepriteParser.parsePadding(frame)).toStrictEqual({w: 1, h: 1})
  })

  test('Converts mixed padding.', () => {
    const frame = {
      frame: {x: 1, y: 2, w: 4, h: 6},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
      sourceSize: {w: 3, h: 4},
      duration: 1
    }
    expect(asepriteParser.parsePadding(frame)).toStrictEqual({w: 1, h: 2})
  })
})

describe('parseDuration()', () => {
  test('Converts Duration.', () => {
    expect(asepriteParser.parseDuration(1)).toStrictEqual(1)
  })

  test('Converts infinite Duration.', () => {
    expect(asepriteParser.parseDuration(65535)).toStrictEqual(
      Number.POSITIVE_INFINITY
    )
  })
})

describe('parseCollision()', () => {
  test('Converts Slice to Rect[].', () => {
    const frameTag = {name: 'stem ', from: 0, to: 0, direction: 'forward'}
    const slices = [
      {
        name: 'stem ',
        color: '#00000000',
        keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
      }
    ]
    expect(asepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([
      {x: 0, y: 1, w: 2, h: 3}
    ])
  })

  test('Filters out unrelated Tags.', () => {
    const frameTag = {name: 'stem ', from: 0, to: 0, direction: 'forward'}
    const slices = [
      {
        name: 'unrelated ',
        color: '#00000000',
        keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
      }
    ]
    expect(asepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([])
  })

  test('Filters out unrelated Frame number Keys.', () => {
    const frameTag = {name: 'stem ', from: 0, to: 2, direction: 'forward'}
    const slices = [
      {
        name: 'stem ',
        color: '#00000000',
        keys: [
          {frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}},
          {frame: 1, bounds: {x: 4, y: 5, w: 6, h: 7}},
          {frame: 2, bounds: {x: 8, y: 9, w: 10, h: 11}}
        ]
      }
    ]
    expect(asepriteParser.parseCollision(frameTag, 1, slices)).toStrictEqual([
      {x: 4, y: 5, w: 6, h: 7}
    ])
  })

  test('Converts Slice with multiple Keys to Rect[].', () => {
    const frameTag = {name: 'stem ', from: 0, to: 1, direction: 'forward'}
    const slices = [
      {
        name: 'stem ',
        color: '#00000000',
        keys: [
          {frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}},
          {frame: 1, bounds: {x: 4, y: 5, w: 6, h: 7}}
        ]
      }
    ]
    expect(asepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([
      {x: 0, y: 1, w: 2, h: 3}
    ])
  })

  test('Converts no Slices.', () => {
    const frameTag = {name: 'stem ', from: 0, to: 0, direction: 'forward'}
    /** @type {ReadonlyArray<aseprite.Slice>} */ const slices = []
    expect(asepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([])
  })

  test('Converts multiple Slices.', () => {
    const frameTag = {name: 'stem ', from: 0, to: 1, direction: 'forward'}
    const slices = [
      {
        name: 'stem ',
        color: '#00000000',
        keys: [
          {frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}},
          {frame: 1, bounds: {x: 4, y: 5, w: 6, h: 7}}
        ]
      },
      {
        name: 'unrelated ',
        color: '#00000000',
        keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
      },
      {
        name: 'stem ',
        color: '#00000000',
        keys: [{frame: 1, bounds: {x: 0, y: 1, w: 2, h: 3}}]
      },
      {
        name: 'stem ',
        color: '#00000000',
        keys: [{frame: 0, bounds: {x: 8, y: 9, w: 10, h: 11}}]
      }
    ]
    expect(asepriteParser.parseCollision(frameTag, 1, slices)).toStrictEqual([
      {x: 4, y: 5, w: 6, h: 7},
      {x: 0, y: 1, w: 2, h: 3},
      {x: 8, y: 9, w: 10, h: 11}
    ])
  })
})

describe('parseAnimationDirection()', () => {
  test.each(
    /** @type {aseprite.Direction[]} */ (util.values(aseprite.Direction))
  )('%# Direction %p', (/** @type {aseprite.Direction} */ direction) =>
    expect(asepriteParser.parseAnimationDirection(direction)).toBeTruthy()
  )

  test('Unknown.', () => {
    expect(() =>
      asepriteParser.parseAnimationDirection('unknown')
    ).toThrowError(/Direction/)
  })
})
