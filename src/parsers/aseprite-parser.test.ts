import * as atlasJSON from '../assets/atlas.json'
import {ArrayUtil} from '../utils/array-util'
import {Aseprite} from './aseprite'
import {AsepriteParser} from './aseprite-parser'
import {Atlas} from '../images/atlas'
import {ObjectUtil} from '../utils/object-util'

describe('atlas.json', () => {
  const file: Aseprite.File = ObjectUtil.freeze(atlasJSON)
  const atlas: Atlas.Definition = ObjectUtil.freeze(AsepriteParser.parse(file))
  const tags: ReadonlyArray<Aseprite.Tag> = ObjectUtil.freeze(
    file.meta.frameTags.map(frameTag => frameTag.name)
  )

  test('Converts current JSON and size is a reasonable power of two', () => {
    expect(atlas.size.w).toBeLessThanOrEqual(4096)
    expect(atlas.size.h).toBeLessThanOrEqual(4096)
    expect(Math.log2(atlas.size.w) % 1).toStrictEqual(0)
    expect(Math.log2(atlas.size.h) % 1).toStrictEqual(0)
  })

  test.each(tags)('%# Tag %p is unique within the sheet', tag => {
    expect(tags.filter(val => val === tag)).toHaveLength(1)
  })

  test.each(tags)('%# Tag %p has a Frame', tag => {
    const frameKeys = ObjectUtil.keys(file.frames)
      .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
      .filter(ArrayUtil.uniq(Object.is))
    expect(frameKeys).toContainEqual(tag)
  })

  {
    const frameKeys = ObjectUtil.keys(file.frames)
      .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
      .filter(ArrayUtil.uniq(Object.is))
    test.each(frameKeys)('%# Frame has a Tag %p', frameKey => {
      expect(tags).toContainEqual(frameKey)
    })
  }

  test.each([...file.meta.slices])('%# Slice name %p is a Tag', slice =>
    expect(tags).toContainEqual(slice.name)
  )

  test.each(
    ObjectUtil.values(atlas.animations).reduce(
      (sum: Atlas.Cel[], val) => sum.concat(val.cels),
      []
    )
  )('%# duration for Cel %p is > 0', (cel: Atlas.Cel) =>
    expect(cel.duration).toBeGreaterThan(0)
  )

  test.each(
    ObjectUtil.values(atlas.animations).reduce(
      (sum: Atlas.Cel[], val) =>
        val.cels.length > 1 ? sum.concat(val.cels) : sum,
      []
    )
  )('%# multi-Cel duration for Cel %p is < ∞', cel =>
    expect(cel.duration).toBeLessThan(Number.POSITIVE_INFINITY)
  )
})

describe('parseAnimations()', () => {
  test('Converts Animations.', () => {
    const frameTags = [
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
        duration: 1
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
      AsepriteParser.parseAnimations(frameTags, frames, slices)
    ).toStrictEqual({
      'cactus s': {
        size: {w: 16, h: 16},
        cels: [
          {
            position: {x: 221, y: 19},
            duration: 1,
            collision: [{x: 8, y: 12, w: 2, h: 3}]
          }
        ],
        duration: 1,
        direction: 'forward'
      },
      'cactus m': {
        size: {w: 16, h: 16},
        cels: [
          {
            position: {x: 91, y: 55},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 7, y: 11, w: 3, h: 4}]
          }
        ],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      },
      'cactus l': {
        size: {w: 16, h: 16},
        cels: [
          {
            position: {x: 73, y: 55},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 7, y: 10, w: 3, h: 5}]
          }
        ],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      },
      'cactus xl': {
        size: {w: 16, h: 16},
        cels: [
          {
            position: {x: 55, y: 55},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 7, y: 9, w: 3, h: 6}]
          }
        ],
        duration: Number.POSITIVE_INFINITY,
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
      AsepriteParser.parseAnimation(frameTag, frames, slices)
    ).toStrictEqual({
      size: {w: 16, h: 16},
      cels: [
        {
          position: {x: 185, y: 37},
          duration: Number.POSITIVE_INFINITY,
          collision: [{x: 4, y: 11, w: 9, h: 4}]
        }
      ],
      duration: Number.POSITIVE_INFINITY,
      direction: 'forward'
    })
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
    expect(AsepriteParser.parseCel(frameTag, frame, 0, slices)).toStrictEqual({
      position: {x: 131, y: 19},
      duration: Number.POSITIVE_INFINITY,
      collision: [{x: 4, y: 4, w: 8, h: 12}]
    })
  })
})

describe('parsePosition()', () => {
  test('Converts 1:1 texture mapping.', () => {
    const frame = {
      frame: {x: 1, y: 2, w: 3, h: 4},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
      sourceSize: {w: 3, h: 4},
      duration: 1
    }
    expect(AsepriteParser.parsePosition(frame)).toStrictEqual({x: 1, y: 2})
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
    expect(AsepriteParser.parsePosition(frame)).toStrictEqual({x: 2, y: 3})
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
    expect(AsepriteParser.parsePadding(frame)).toStrictEqual({w: 0, h: 0})
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
    expect(AsepriteParser.parsePadding(frame)).toStrictEqual({w: 1, h: 1})
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
    expect(AsepriteParser.parsePadding(frame)).toStrictEqual({w: 1, h: 2})
  })
})

describe('parseDuration()', () => {
  test('Converts Duration.', () => {
    expect(AsepriteParser.parseDuration(1)).toStrictEqual(1)
  })

  test('Converts infinite Duration.', () => {
    expect(AsepriteParser.parseDuration(65535)).toStrictEqual(
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
    expect(AsepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([
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
    expect(AsepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([])
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
    expect(AsepriteParser.parseCollision(frameTag, 1, slices)).toStrictEqual([
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
    expect(AsepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([
      {x: 0, y: 1, w: 2, h: 3}
    ])
  })

  test('Converts no Slices.', () => {
    const frameTag = {name: 'stem ', from: 0, to: 0, direction: 'forward'}
    const slices = <ReadonlyArray<Aseprite.Slice>>[]
    expect(AsepriteParser.parseCollision(frameTag, 0, slices)).toStrictEqual([])
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
    expect(AsepriteParser.parseCollision(frameTag, 1, slices)).toStrictEqual([
      {x: 4, y: 5, w: 6, h: 7},
      {x: 0, y: 1, w: 2, h: 3},
      {x: 8, y: 9, w: 10, h: 11}
    ])
  })
})
