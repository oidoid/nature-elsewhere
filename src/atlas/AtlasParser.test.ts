import {Aseprite} from './Aseprite'
import {AtlasParser} from './AtlasParser'

describe('parse()', () => {
  test('Parses Animations.', () => {
    const frameTags = [
      {name: 'sceneryCloud', from: 0, to: 0, direction: 'forward'},
      {name: 'palette-red', from: 1, to: 1, direction: 'forward'},
      {name: 'sceneryConifer', from: 2, to: 2, direction: 'forward'},
      {name: 'sceneryConifer-shadow', from: 3, to: 3, direction: 'forward'}
    ]
    const frames = {
      'sceneryCloud 0': {
        frame: {x: 220, y: 18, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 1
      },
      'palette-red 1': {
        frame: {x: 90, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'sceneryConifer 2': {
        frame: {x: 72, y: 54, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'sceneryConifer-shadow 3': {
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
      sceneryCloud: {
        size: {w: 16, h: 16},
        cels: [{position: {x: 221, y: 19}, duration: 1}],
        duration: 1,
        direction: 'forward'
      },
      'palette-red': {
        size: {w: 16, h: 16},
        cels: [{position: {x: 91, y: 55}, duration: Number.POSITIVE_INFINITY}],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      },
      sceneryConifer: {
        size: {w: 16, h: 16},
        cels: [{position: {x: 73, y: 55}, duration: Number.POSITIVE_INFINITY}],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      },
      'sceneryConifer-shadow': {
        size: {w: 16, h: 16},
        cels: [{position: {x: 55, y: 55}, duration: Number.POSITIVE_INFINITY}],
        duration: Number.POSITIVE_INFINITY,
        direction: 'forward'
      }
    })
  })
})

describe('parseAnimation()', () => {
  test('Parses FrameTag and Frame from Frame[].', () => {
    const frameTag = {
      name: 'sceneryCloud s',
      from: 1,
      to: 1,
      direction: 'forward'
    }
    const frames = {
      'sceneryCloud xs 0': {
        frame: {x: 202, y: 36, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'sceneryCloud s 1': {
        frame: {x: 184, y: 36, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      },
      'sceneryCloud m 2': {
        frame: {x: 166, y: 36, w: 18, h: 18},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
        sourceSize: {w: 16, h: 16},
        duration: 65535
      }
    }
    expect(AtlasParser.parseAnimation(frameTag, frames)).toStrictEqual({
      size: {w: 16, h: 16},
      cels: [{position: {x: 185, y: 37}, duration: Number.POSITIVE_INFINITY}],
      duration: Number.POSITIVE_INFINITY,
      direction: 'forward'
    })
  })
})

describe('isAnimationDirection()', () => {
  test.each(Object.values(Aseprite.AnimationDirection))(
    '%# Direction %p',
    direction =>
      expect(AtlasParser.isAnimationDirection(direction)).toStrictEqual(true)
  )

  test('Unknown.', () =>
    expect(AtlasParser.isAnimationDirection('unknown')).toStrictEqual(false))
})

describe('parseCel()', () => {
  test('Parses 1:1 texture mapping.', () => {
    const frame = {
      frame: {x: 130, y: 18, w: 18, h: 18},
      rotated: false,
      trimmed: false,
      spriteSourceSize: {x: 0, y: 0, w: 16, h: 16},
      sourceSize: {w: 16, h: 16},
      duration: 65535
    }
    expect(AtlasParser.parseCel(frame)).toStrictEqual({
      position: {x: 131, y: 19},
      duration: Number.POSITIVE_INFINITY
    })
  })
})

describe('parsePosition()', () => {
  test('Parses 1:1 texture mapping.', () => {
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

  test('Parses texture mapping with padding.', () => {
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
  test('Parses zero padding.', () => {
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

  test('Parses nonzero padding.', () => {
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

  test('Parses mixed padding.', () => {
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
  test('Parses finite duration.', () =>
    expect(AtlasParser.parseDuration(1)).toStrictEqual(1))

  test('Parses infinite duration.', () =>
    expect(AtlasParser.parseDuration(65535)).toStrictEqual(
      Number.POSITIVE_INFINITY
    ))
})
