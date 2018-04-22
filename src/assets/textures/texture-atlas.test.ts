import * as Aseprite from './aseprite'
import {unmarshalDuration, unmarshalCollision} from './texture-atlas'

describe('TextureAtlas', () => {
  describe('.unmarshalDuration()', () => {
    test('Convert Duration to number.', () => {
      expect(unmarshalDuration(0)).toEqual(0)
    })
    test('Convert infinite Duration to +∞.', () => {
      expect(unmarshalDuration(Aseprite.INFINITE_DURATION)).toEqual(
        Number.POSITIVE_INFINITY
      )
    })
  })

  describe('.unmarshalCollision()', () => {
    test('Convert Slice to Rect[].', () => {
      const slices = [
        {
          name: 'tag',
          color: '#00000000',
          keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
        }
      ]
      expect(unmarshalCollision(slices, 'tag', 0)).toEqual([
        {x: 0, y: 1, w: 2, h: 3}
      ])
    })

    test('Filter out unrelated Tags.', () => {
      const slices = [
        {
          name: 'unrelated',
          color: '#00000000',
          keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
        }
      ]
      expect(unmarshalCollision(slices, 'tag', 0)).toEqual([])
    })

    test('Filter out unrelated Frame numbers.', () => {
      const slices = [
        {
          name: 'tag',
          color: '#00000000',
          keys: [{frame: 1, bounds: {x: 0, y: 1, w: 2, h: 3}}]
        }
      ]
      expect(unmarshalCollision(slices, 'tag', 0)).toEqual([])
    })

    test('Convert Slice with multiple keys to Rect[].', () => {
      const slices = [
        {
          name: 'tag',
          color: '#00000000',
          keys: [
            {frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}},
            {frame: 1, bounds: {x: 4, y: 5, w: 6, h: 7}}
          ]
        }
      ]
      expect(unmarshalCollision(slices, 'tag', 0)).toEqual([
        {x: 0, y: 1, w: 2, h: 3}
      ])
    })

    test('Convert no Slices.', () => {
      const slices: Aseprite.Slice[] = []
      expect(unmarshalCollision(slices, 'tag', 0)).toEqual([])
    })

    test('Convert multiple Slices.', () => {
      const slices = [
        {
          name: 'tag',
          color: '#00000000',
          keys: [
            {frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}},
            {frame: 1, bounds: {x: 4, y: 5, w: 6, h: 7}}
          ]
        },
        {
          name: 'unrelated',
          color: '#00000000',
          keys: [{frame: 0, bounds: {x: 0, y: 1, w: 2, h: 3}}]
        },
        {
          name: 'tag',
          color: '#00000000',
          keys: [{frame: 1, bounds: {x: 0, y: 1, w: 2, h: 3}}]
        },
        {
          name: 'tag',
          color: '#00000000',
          keys: [{frame: 0, bounds: {x: 8, y: 9, w: 10, h: 11}}]
        }
      ]
      expect(unmarshalCollision(slices, 'tag', 0)).toEqual([
        {x: 0, y: 1, w: 2, h: 3},
        {x: 8, y: 9, w: 10, h: 11}
      ])
    })
  })
})
