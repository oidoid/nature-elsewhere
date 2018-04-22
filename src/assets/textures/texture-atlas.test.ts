import * as Aseprite from './aseprite'
import {
  unmarshalAnimation,
  marshalTagFrameNumber,
  unmarshalCel,
  unmarshalTexture,
  unmarshalPadding,
  unmarshalDuration,
  unmarshalCollision
} from './texture-atlas'

describe('texture-atlas', () => {
  describe('#unmarshalAnimation()', () => {
    test('Converts FrameTag, Frame from Frame[], and Slice.', () => {
      const frameTag = {
        name: 'cloud s',
        from: 1,
        to: 1,
        direction: <Aseprite.Direction>'forward'
      }
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
      expect(unmarshalAnimation(frameTag, frames, slices)).toEqual({
        cels: [
          {
            texture: {x: 185, y: 37, w: 16, h: 16},
            duration: Number.POSITIVE_INFINITY,
            collision: [{x: 4, y: 11, w: 9, h: 4}]
          }
        ],
        direction: Aseprite.Direction.FORWARD
      })
    })
  })

  describe('#marshalTagFrameNumber()', () => {
    test('Converts Tag and Frame number.', () => {
      expect(marshalTagFrameNumber('stem ', 0)).toEqual('stem  0')
    })

    test('Converts Tag.', () => {
      expect(marshalTagFrameNumber('stem ')).toEqual('stem  ')
    })
  })

  describe('#unmarshalCel()', () => {
    test('Converts 1:1 texture mapping.', () => {
      const frameTag = {
        name: 'stem ',
        from: 0,
        to: 0,
        direction: <Aseprite.Direction>'forward'
      }
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
      expect(unmarshalCel(frameTag, frame, 0, slices)).toEqual({
        texture: {x: 131, y: 19, w: 16, h: 16},
        duration: Number.POSITIVE_INFINITY,
        collision: [{x: 4, y: 4, w: 8, h: 12}]
      })
    })
  })

  describe('#unmarshalTexture()', () => {
    test('Converts 1:1 texture mapping.', () => {
      const frame = {
        frame: {x: 1, y: 2, w: 3, h: 4},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
        sourceSize: {w: 3, h: 4},
        duration: 1
      }
      expect(unmarshalTexture(frame)).toEqual({x: 1, y: 2, w: 3, h: 4})
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
      expect(unmarshalTexture(frame)).toEqual({x: 2, y: 3, w: 3, h: 4})
    })
  })

  describe('#unmarshalPadding()', () => {
    test('Converts zero padding.', () => {
      const frame = {
        frame: {x: 1, y: 2, w: 3, h: 4},
        rotated: false,
        trimmed: false,
        spriteSourceSize: {x: 0, y: 0, w: 3, h: 4},
        sourceSize: {w: 3, h: 4},
        duration: 1
      }
      expect(unmarshalPadding(frame)).toEqual({w: 0, h: 0})
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
      expect(unmarshalPadding(frame)).toEqual({w: 1, h: 1})
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
      expect(unmarshalPadding(frame)).toEqual({w: 1, h: 2})
    })
  })

  describe('#unmarshalDuration()', () => {
    test('Convert Duration.', () => {
      expect(unmarshalDuration(0)).toEqual(0)
    })

    test('Convert infinite Duration.', () => {
      expect(unmarshalDuration(Aseprite.INFINITE_DURATION)).toEqual(
        Number.POSITIVE_INFINITY
      )
    })
  })

  describe('#unmarshalCollision()', () => {
    test('Convert Slice to Rect[].', () => {
      const frameTag = {
        name: 'stem ',
        from: 0,
        to: 0,
        direction: <Aseprite.Direction>'forward'
      }
      const slices = [
        {
          name: 'stem ',
          color: '#00000000',
          keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
        }
      ]
      expect(unmarshalCollision(frameTag, 0, slices)).toEqual([
        {x: 0, y: 1, w: 2, h: 3}
      ])
    })

    test('Filter out unrelated Tags.', () => {
      const frameTag = {
        name: 'stem ',
        from: 0,
        to: 0,
        direction: <Aseprite.Direction>'forward'
      }
      const slices = [
        {
          name: 'unrelated ',
          color: '#00000000',
          keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
        }
      ]
      expect(unmarshalCollision(frameTag, 0, slices)).toEqual([])
    })

    test('Filter out unrelated Frame number Keys.', () => {
      const frameTag = {
        name: 'stem ',
        from: 0,
        to: 2,
        direction: <Aseprite.Direction>'forward'
      }
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
      expect(unmarshalCollision(frameTag, 1, slices)).toEqual([
        {x: 4, y: 5, w: 6, h: 7}
      ])
    })

    test('Convert Slice with multiple keys to Rect[].', () => {
      const frameTag = {
        name: 'stem ',
        from: 0,
        to: 1,
        direction: <Aseprite.Direction>'forward'
      }
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
      expect(unmarshalCollision(frameTag, 0, slices)).toEqual([
        {x: 0, y: 1, w: 2, h: 3}
      ])
    })

    test('Convert no Slices.', () => {
      const frameTag = {
        name: 'stem ',
        from: 0,
        to: 0,
        direction: <Aseprite.Direction>'forward'
      }
      const slices: Aseprite.Slice[] = []
      expect(unmarshalCollision(frameTag, 0, slices)).toEqual([])
    })

    test('Convert multiple Slices.', () => {
      const frameTag = {
        name: 'stem ',
        from: 0,
        to: 1,
        direction: <Aseprite.Direction>'forward'
      }
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
      expect(unmarshalCollision(frameTag, 1, slices)).toEqual([
        {x: 4, y: 5, w: 6, h: 7},
        {x: 0, y: 1, w: 2, h: 3},
        {x: 8, y: 9, w: 10, h: 11}
      ])
    })
  })
})
