import {ArrayUtil} from '../utils/array-util'
import {Aseprite} from './aseprite'
import {Atlas} from './atlas'
import * as atlasJSON from '../assets/atlas/atlas.json'
import {AtlasParser} from './atlas-parser'
import {ObjectUtil} from '../utils/object-util'

describe('atlas.json', () => {
  const file = Object.freeze(atlasJSON)
  const atlas = Object.freeze(AtlasParser.parse(file))
  const tags = Object.freeze(file.meta.frameTags.map(frameTag => frameTag.name))

  test.each(tags)('%# Tag %p is unique within the sheet', tag =>
    expect(tags.filter(val => val === tag)).toHaveLength(1)
  )

  test.each(tags)('%# Tag %p has a Frame', tag => {
    const frameKeys = ObjectUtil.keys(file.frames)
      .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
      .filter(ArrayUtil.unique(Object.is))
    expect(frameKeys).toContainEqual(tag)
  })

  {
    const frameKeys = ObjectUtil.keys(file.frames)
      .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
      .filter(ArrayUtil.unique(Object.is))
    test.each(frameKeys)('%# Frame has a Tag %p', frameKey =>
      expect(tags).toContainEqual(frameKey)
    )
  }

  test.each(
    ObjectUtil.values(atlas).reduce(
      (sum: Atlas.Cel[], val) => sum.concat(val.cels),
      []
    )
  )('%# duration for Cel %p is > 0', (cel: Atlas.Cel) =>
    expect(cel.duration).toBeGreaterThan(0)
  )

  test.each(
    ObjectUtil.values(atlas).reduce(
      (sum: Atlas.Cel[], val) =>
        val.cels.length > 1 ? sum.concat(val.cels) : sum,
      []
    )
  )('%# multi-Cel duration for Cel %p is < ∞', cel =>
    expect(cel.duration).toBeLessThan(Number.POSITIVE_INFINITY)
  )

  test.each(ObjectUtil.values(atlas))(
    '%# every Animation has at lease one Cel %p',
    ({cels}) => expect(cels.length).toBeGreaterThan(0)
  )
})

describe('parse()', () => {
  test('Converts Animations.', () => {
    const frameTags = [
      {name: 'cloud ', from: 0, to: 0, direction: 'forward'},
      {name: 'palette red', from: 1, to: 1, direction: 'forward'},
      {name: 'conifer ', from: 2, to: 2, direction: 'forward'},
      {name: 'conifer shadow', from: 3, to: 3, direction: 'forward'}
    ]
    const frames = {
      'cloud  0': {
        frame: {x: 220, y: 18, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 1
      },
      'palette red 1': {
        frame: {x: 90, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'conifer  2': {
        frame: {x: 72, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'conifer shadow 3': {
        frame: {x: 54, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      }
    }
    expect(
      AtlasParser.parse({meta: <Aseprite.Meta>(<unknown>{frameTags}), frames})
    ).toStrictEqual({
      'cloud ': {
        w: 16,
        h: 16,
        cels: [{x: 221, y: 19, duration: 1}],
        duration: 1,
        direction: 'forward'
      },
      'palette red': {
        w: 16,
        h: 16,
        cels: [{x: 91, y: 55, duration: Number.POSITIVE_INFINITY}],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      },
      'conifer ': {
        w: 16,
        h: 16,
        cels: [{x: 73, y: 55, duration: Number.POSITIVE_INFINITY}],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      },
      'conifer shadow': {
        w: 16,
        h: 16,
        cels: [{x: 55, y: 55, duration: Number.POSITIVE_INFINITY}],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      }
    })
  })
})

describe('parseAnimation()', () => {
  test('Converts FrameTag and Frame from Frame[].', () => {
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
    expect(AtlasParser.parseAnimation(frameTag, frames)).toStrictEqual({
      w: 16,
      h: 16,
      cels: [{x: 185, y: 37, duration: Number.POSITIVE_INFINITY}],
      duration: Number.POSITIVE_INFINITY,
      direction: 'forward'
    })
  })
})

describe('isAnimationDirection()', () => {
  test.each(ObjectUtil.values(Aseprite.AnimationDirection))(
    '%# Direction %p',
    direction =>
      expect(AtlasParser.isAnimationDirection(direction)).toStrictEqual(true)
  )

  test('Unknown.', () =>
    expect(AtlasParser.isAnimationDirection('unknown')).toStrictEqual(false))
})

describe('parseCel()', () => {
  test('Converts 1:1 texture mapping.', () => {
    const frame = {
      frame: {x: 130, y: 18, w: 18, h: 18},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
      sourceSize: {w: 16, h: 16},
      duration: 65535
    }
    expect(AtlasParser.parseCel(frame)).toStrictEqual({
      x: 131,
      y: 19,
      duration: Number.POSITIVE_INFINITY
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
    expect(AtlasParser.parsePosition(frame)).toStrictEqual({x: 1, y: 2})
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
    expect(AtlasParser.parsePosition(frame)).toStrictEqual({x: 2, y: 3})
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
    expect(AtlasParser.parsePadding(frame)).toStrictEqual({w: 0, h: 0})
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
    expect(AtlasParser.parsePadding(frame)).toStrictEqual({w: 1, h: 1})
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
    expect(AtlasParser.parsePadding(frame)).toStrictEqual({w: 1, h: 2})
  })
})

describe('parseDuration()', () => {
  test('Converts Duration.', () =>
    expect(AtlasParser.parseDuration(1)).toStrictEqual(1))

  test('Converts infinite Duration.', () =>
    expect(AtlasParser.parseDuration(65535)).toStrictEqual(
      Number.POSITIVE_INFINITY
    ))
})
