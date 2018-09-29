import * as atlas from './atlas'
import * as entity from './entity'
import * as util from '../util'

describe('stepAnimation()', () => {
  test('No cels', () => {
    const state = {cel: 0, celTime: 0}
    const animation = {cels: [], direction: atlas.AnimationDirection.FORWARD}
    entity.stepAnimation(state, 1, animation)
    expect(state).toStrictEqual({cel: 0, celTime: 0})
  })

  test('time < duration', () => {
    const state = {cel: 0, celTime: 0}
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 2, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    entity.stepAnimation(state, 0.001, animation)
    expect(state).toStrictEqual({cel: 0, celTime: 1})
  })

  test('time === duration', () => {
    const state = {cel: 0, celTime: 0}
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    entity.stepAnimation(state, 0.001, animation)
    expect(state).toStrictEqual({cel: 1, celTime: 0})
  })

  test('time > duration', () => {
    const state = {cel: 0, celTime: 0}
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    entity.stepAnimation(state, 0.002, animation)
    expect(state).toStrictEqual({cel: 1, celTime: 1})
  })
})

describe('nextCel()', () => {
  test.each(util.values(atlas.AnimationDirection))(
    '%# direction %p array start',
    (direction: atlas.AnimationDirection) => {
      const state = {cel: 0, celTime: 0}
      const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
      const animation = {cels: [cel, cel], direction}
      const actual = Math.abs(
        entity.nextCel(state, animation) % animation.cels.length
      )
      expect(actual).toStrictEqual(1)
    }
  )

  test.each(util.values(atlas.AnimationDirection))(
    '%# direction %p array end',
    (direction: atlas.AnimationDirection) => {
      const state = {cel: 1, celTime: 0}
      const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
      const animation = {cels: [cel, cel], direction}
      const actual = entity.nextCel(state, animation) % animation.cels.length
      expect(actual).toStrictEqual(0)
    }
  )

  test.each(util.values(atlas.AnimationDirection))(
    '%# duration met direction %p cycles',
    (direction: atlas.AnimationDirection) => {
      const state = {cel: 0, celTime: 0}
      const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
      const animation = {cels: [cel, cel, cel, cel, cel], direction}
      const actual = []
      for (let i = 0; i < animation.cels.length * 3; ++i) {
        state.cel = entity.nextCel(state, animation)
        actual.push(entity.cel(state, animation))
      }
      // prettier-ignore
      const expected = {
        [atlas.AnimationDirection.FORWARD]: [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
        [atlas.AnimationDirection.REVERSE]: [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0],
        [atlas.AnimationDirection.PING_PONG]: [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1],
      }
      expect(actual).toStrictEqual(expected[direction])
    }
  )
})
