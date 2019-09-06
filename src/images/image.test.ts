import {Atlas} from '../atlas/atlas'
import {Image} from './image'

const defaults: Image = Object.freeze({
  id: 'id',
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  layer: 'DEFAULT',
  scale: {x: 1, y: 1},
  tx: 0,
  ty: 0,
  tvx: 0,
  tvy: 0,
  period: 0,
  exposure: 0
})

const atlas: Atlas = Object.freeze({
  id: {
    w: 9,
    h: 9,
    cels: [{x: 0, y: 0, duration: 0, collisions: [{x: 0, y: 0, w: 5, h: 5}]}],
    duration: 0,
    direction: Atlas.AnimationDirection.FORWARD
  }
})

describe('collides()', () => {
  test('collision from origin', () => {
    const subject = {...defaults, w: 9, h: 9}
    const img = {...defaults, w: 5, h: 5}
    const rect = {x: 0, y: 0, w: 5, h: 5}
    expect(Image.collides(subject, img, atlas, {x: 0, y: 0})).toStrictEqual(
      rect
    )
  })

  test('collision from non-origin', () => {
    const subject = {...defaults, w: 9, h: 9}
    const img = {...defaults, w: 5, h: 5}
    const rect = {x: 0, y: 0, w: 5, h: 5}
    expect(Image.collides(subject, img, atlas, {x: 2, y: 2})).toStrictEqual(
      rect
    )
  })

  test('non-collision from origin', () => {
    const subject = {...defaults, w: 9, h: 9}
    const img = {...defaults, x: 10, y: 10, w: 5, h: 5}
    expect(Image.collides(subject, img, atlas, {x: 0, y: 0})).toBeUndefined()
  })

  test('non-collision from non-origin', () => {
    const subject = {...defaults, w: 9, h: 9}
    const img = {...defaults, w: 5, h: 5}
    expect(Image.collides(subject, img, atlas, {x: 8, y: 8})).toBeUndefined()
  })
})

describe('collidesRect()', () => {
  test('collision from origin', () => {
    const subject = {...defaults, w: 9, h: 9}
    const rect = {x: 0, y: 0, w: 5, h: 5}
    expect(Image.collidesRect(subject, rect, atlas)).toStrictEqual(rect)
  })

  test('collision from non-origin', () => {
    const subject = {...defaults, x: 3, y: 3, w: 9, h: 9}
    const rect = {x: 0, y: 0, w: 5, h: 5}
    expect(Image.collidesRect(subject, rect, atlas)).toStrictEqual(rect)
  })

  test('non-collision from origin', () => {
    const subject = {...defaults, w: 9, h: 9}
    const rect = {x: 10, y: 10, w: 5, h: 5}
    expect(Image.collidesRect(subject, rect, atlas)).toBeUndefined()
  })

  test('non-collision from non-origin', () => {
    const subject = {...defaults, x: 3, y: 3, w: 9, h: 9}
    const rect = {x: 0, y: 0, w: 1, h: 1}
    expect(Image.collidesRect(subject, rect, atlas)).toBeUndefined()
  })
})
