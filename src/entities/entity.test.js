import * as animation from './animation.js'
import * as atlas from './atlas.js'
import * as entity from './entity.js'
import * as util from '../util.js'

/**
 * @param {number} cel
 * @param {number} celTime
 * @return {entity.State}
 */
function newEntity(cel, celTime) {
  return new entity.State(
    entity.Type.CLOUD,
    {x: 0, y: 0},
    animation.ID.CLOUD_S,
    entity.DrawOrder.CLOUDS,
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    cel,
    celTime
  )
}

describe('stepAnimation()', () => {
  test('No cels', () => {
    const state = newEntity(0, 0)
    const animation = {cels: [], direction: atlas.AnimationDirection.FORWARD}
    state.stepAnimation(1, animation)
    expect(state).toMatchObject({_cel: 0, celTime: 0})
  })

  test('time < duration', () => {
    const state = newEntity(0, 0)
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 2, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    state.stepAnimation(1, animation)
    expect(state).toMatchObject({_cel: 0, celTime: 1})
  })

  test('time === duration', () => {
    const state = newEntity(0, 0)
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    state.stepAnimation(1, animation)
    expect(state).toMatchObject({_cel: 1, celTime: 0})
  })

  test('time > duration', () => {
    const state = newEntity(0, 0)
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    state.stepAnimation(2, animation)
    expect(state).toMatchObject({_cel: 1, celTime: 1})
  })
})

describe('nextCel()', () => {
  test.each(
    /** @type {atlas.AnimationDirection[]} */ (util.values(
      atlas.AnimationDirection
    ))
  )('%# direction %p array start', (
    /** @type {atlas.AnimationDirection} */ direction
  ) => {
    const state = newEntity(0, 0)
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
    const animation = {cels: [cel, cel], direction}
    const actual = Math.abs(state.nextCel(animation) % animation.cels.length)
    expect(actual).toStrictEqual(1)
  })

  test.each(
    /** @type {atlas.AnimationDirection[]} */ (util.values(
      atlas.AnimationDirection
    ))
  )('%# direction %p array end', (
    /** @type {atlas.AnimationDirection} */ direction
  ) => {
    const state = newEntity(1, 0)
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
    const animation = {cels: [cel, cel], direction}
    const actual = state.nextCel(animation) % animation.cels.length
    expect(actual).toStrictEqual(0)
  })

  test.each(
    /** @type {atlas.AnimationDirection[]} */ (util.values(
      atlas.AnimationDirection
    ))
  )('%# duration met direction %p cycles', (
    /** @type {atlas.AnimationDirection} */ direction
  ) => {
    const state = newEntity(0, 0)
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
    const animation = {cels: [cel, cel, cel, cel, cel], direction}
    const actual = []
    for (let i = 0; i < animation.cels.length * 3; ++i) {
      state._cel = state.nextCel(animation)
      actual.push(state.cel(animation))
    }
    // prettier-ignore
    const expected = {
      [atlas.AnimationDirection.FORWARD]: [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
      [atlas.AnimationDirection.REVERSE]: [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0],
      [atlas.AnimationDirection.PING_PONG]: [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1],
    }
    expect(actual).toStrictEqual(expected[direction])
  })
})
