import * as atlas from './atlas.js'
import * as util from '../util.js'
import {Animator} from './animator.js'

describe('step()', () => {
  test('No cels', () => {
    const subject = new Animator()
    subject.step(1)
    expect(subject).toMatchObject({_cel: 0, _celTime: 0})
  })

  test('time < duration', () => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 2, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(1)
    expect(subject).toMatchObject({_cel: 0, _celTime: 1})
  })

  test('time === duration', () => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(1)
    expect(subject).toMatchObject({_cel: 1, _celTime: 0})
  })

  test('time > duration', () => {
    const cel = {bounds: {x: 0, y: 0, w: 0, h: 0}, duration: 1, collision: []}
    const animation = {
      cels: [cel, cel],
      direction: atlas.AnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(2)
    expect(subject).toMatchObject({_cel: 1, _celTime: 1})
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
    const subject = new Animator(animation)
    subject.step(1)
    const actual = subject.celIndex
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
    const subject = new Animator(animation, 1)
    subject.step(1)
    const actual = subject.celIndex
    expect(actual).toStrictEqual(0)
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
    const subject = new Animator(animation)
    const actual = []
    for (let i = 0; i < animation.cels.length * 3; ++i) {
      subject.step(1)
      actual.push(subject.celIndex)
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
