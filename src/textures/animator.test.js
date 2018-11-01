import * as animator from './animator.js'
import * as atlas from './atlas.js'
import * as util from '../util.js'

describe('step()', () => {
  test('No cels', () => {
    const animation = {cels: [], direction: atlas.AnimationDirection.FORWARD}
    const subject = animator.newState(animation)
    animator.step(subject, 1)
    expect(subject).toMatchObject({period: 0, duration: 0})
  })

  test('time < duration', () => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 2, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    const subject = animator.newState(animation)
    animator.step(subject, 1)
    expect(subject).toMatchObject({period: 0, duration: 1})
  })

  test('time === duration', () => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    const subject = animator.newState(animation)
    animator.step(subject, 1)
    expect(subject).toMatchObject({period: 1, duration: 0})
  })

  test('time > duration', () => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    const subject = animator.newState(animation)
    animator.step(subject, 2)
    expect(subject).toMatchObject({period: 1, duration: 1})
  })
})

describe('celIndex', () => {
  test.each(
    /** @type {atlas.AnimationDirection[]} */ (util.values(
      atlas.AnimationDirection
    ))
  )('%# direction %p array start', (
    /** @type {atlas.AnimationDirection} */ direction
  ) => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
    const animation = {cels: [cel, cel], direction}
    const subject = animator.newState(animation)
    animator.step(subject, 1)
    const actual = animator.celIndex(subject)
    expect(actual).toStrictEqual(1)
  })

  test.each(
    /** @type {atlas.AnimationDirection[]} */ (util.values(
      atlas.AnimationDirection
    ))
  )('%# direction %p array end', (
    /** @type {atlas.AnimationDirection} */ direction
  ) => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
    const animation = {cels: [cel, cel], direction}
    const subject = animator.newState(animation, 1)
    animator.step(subject, 1)
    const actual = animator.celIndex(subject)
    expect(actual).toStrictEqual(0)
  })

  test.each([
    [
      atlas.AnimationDirection.FORWARD,
      Number.MIN_SAFE_INTEGER,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      atlas.AnimationDirection.FORWARD,
      0,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      atlas.AnimationDirection.FORWARD,
      Number.MAX_SAFE_INTEGER,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      atlas.AnimationDirection.REVERSE,
      Number.MIN_SAFE_INTEGER,
      [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]
    ],
    [
      atlas.AnimationDirection.REVERSE,
      0,
      [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]
    ],
    [
      atlas.AnimationDirection.REVERSE,
      Number.MIN_SAFE_INTEGER,
      [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]
    ],
    [
      atlas.AnimationDirection.PING_PONG,
      -2,
      [3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2]
    ],
    [
      atlas.AnimationDirection.PING_PONG,
      0,
      [1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2]
    ],
    [
      atlas.AnimationDirection.PING_PONG,
      3,
      [2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1]
    ]
  ])('%# direction %p bounds %p', (
    /** @type {atlas.AnimationDirection} */ direction,
    /** @type {number} */ period,
    /** @type {ReadonlyArray<number>} */ expected
  ) => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
    const animation = {cels: [cel, cel, cel, cel], direction}
    const subject = animator.newState(animation, period)
    const actual = []
    for (let i = 0; i < animation.cels.length * 5; ++i) {
      animator.step(subject, 1)
      actual.push(animator.celIndex(subject))
    }
    expect(actual).toStrictEqual(expected)
  })

  test.each(
    /** @type {atlas.AnimationDirection[]} */ (util.values(
      atlas.AnimationDirection
    ))
  )('%# duration met direction %p cycles', (
    /** @type {atlas.AnimationDirection} */ direction
  ) => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 0, collision: []}
    const animation = {cels: [cel, cel, cel, cel, cel], direction}
    const subject = animator.newState(animation)
    const actual = []
    for (let i = 0; i < animation.cels.length * 3; ++i) {
      animator.step(subject, 1)
      actual.push(animator.celIndex(subject))
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
