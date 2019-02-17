import * as object from '../utils/object'
import {Animator} from './animator'
import {AtlasAnimationDirection} from './atlas-definition'
import {AnimationDirection} from '../parsers/aseprite-format'

describe('step()', () => {
  test('No cels', () => {
    const animation = {
      size: {w: 0, h: 0},
      cels: [],
      duration: 0,
      direction: AtlasAnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(1)
    expect(subject).toMatchObject({_period: 0, _duration: 0})
  })

  test('time < duration', () => {
    const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel],
      duration: 2,
      direction: AtlasAnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(0.5)
    expect(subject).toMatchObject({_period: 0, _duration: 0.5})
  })

  test('time === duration', () => {
    const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel],
      duration: 2,
      direction: AtlasAnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(1)
    expect(subject).toMatchObject({_period: 1, _duration: 0})
  })

  test('time > duration', () => {
    const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel],
      duration: 2,
      direction: AtlasAnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(1.5)
    expect(subject).toMatchObject({_period: 1, _duration: 0.5})
  })
})

describe('celIndex', () => {
  test.each(object.values(AtlasAnimationDirection))(
    '%# direction %p array start',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel],
        duration: 2,
        direction
      }
      const subject = new Animator(animation)
      subject.step(1)
      const actual = subject.celIndex()
      expect(actual).toStrictEqual(1)
    }
  )

  test.each(object.values(AtlasAnimationDirection))(
    '%# direction %p array end',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel],
        duration: 2,
        direction
      }
      const subject = new Animator(animation, 1)
      subject.step(1)
      const actual = subject.celIndex()
      expect(actual).toStrictEqual(0)
    }
  )

  test.each(<
    ReadonlyArray<Readonly<[AnimationDirection, number, ReadonlyArray<number>]>>
  >[
    [
      AtlasAnimationDirection.FORWARD,
      0,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      AtlasAnimationDirection.FORWARD,
      Number.MAX_SAFE_INTEGER,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      AtlasAnimationDirection.REVERSE,
      Number.MIN_SAFE_INTEGER,
      [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]
    ],
    [
      AtlasAnimationDirection.REVERSE,
      3,
      [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3]
    ],
    [
      AtlasAnimationDirection.PING_PONG,
      -2,
      [3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2]
    ],
    [
      AtlasAnimationDirection.PING_PONG,
      0,
      [1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2]
    ],
    [
      AtlasAnimationDirection.PING_PONG,
      3,
      [2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1]
    ]
  ])('%# direction %p bounds %p', (direction, period, expected) => {
    const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
    const animation = {
      size: {w: 0, h: 0},
      cels: [cel, cel, cel, cel],
      duration: 4,
      direction
    }
    const subject = new Animator(animation, period)
    const actual = []
    for (let i = 0; i < animation.cels.length * 5; ++i) {
      subject.step(1)
      actual.push(subject.celIndex())
    }
    expect(actual).toStrictEqual(expected)
  })

  test.each(object.values(AtlasAnimationDirection))(
    '%# duration met direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      const subject = new Animator(animation)
      const actual = []
      for (let i = 0; i < animation.cels.length * 3; ++i) {
        subject.step(1)
        actual.push(subject.celIndex())
      }
      // prettier-ignore
      const expected = {
        [AtlasAnimationDirection.FORWARD]:   [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
        [AtlasAnimationDirection.REVERSE]:   [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0],
        [AtlasAnimationDirection.PING_PONG]: [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1],
      }
      expect(actual).toStrictEqual(expected[direction])
    }
  )

  test.each(object.values(AtlasAnimationDirection))(
    '%# fractional duration met direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      const subject = new Animator(animation)
      const actual = []
      for (let i = 0; i < animation.cels.length * 6; ++i) {
        subject.step(0.5)
        actual.push(subject.celIndex())
      }
      // prettier-ignore
      const expected = {
        [AtlasAnimationDirection.FORWARD]:   [0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0],
        [AtlasAnimationDirection.REVERSE]:   [0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0],
        [AtlasAnimationDirection.PING_PONG]: [0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1],
      }
      expect(actual).toStrictEqual(expected[direction])
    }
  )

  test.each(object.values(AtlasAnimationDirection))(
    '%# duration not met direction %p cycles',
    direction => {
      const cel = {position: {x: 0, y: 0}, duration: 1, collision: []}
      const animation = {
        size: {w: 0, h: 0},
        cels: [cel, cel, cel, cel, cel],
        duration: 5,
        direction
      }
      const subject = new Animator(animation)
      const actual = []
      for (let i = 0; i < animation.cels.length * 6; ++i) {
        subject.step(0.9)
        actual.push(subject.celIndex())
      }
      // prettier-ignore
      const expected = {
        [AtlasAnimationDirection.FORWARD]:   [0, 1, 2, 3, 4, 0, 1, 2, 3, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 1],
        [AtlasAnimationDirection.REVERSE]:   [0, 4, 3, 2, 1, 0, 4, 3, 2, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 4],
        [AtlasAnimationDirection.PING_PONG]: [0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 2]
      }
      expect(actual).toStrictEqual(expected[direction])
    }
  )
})
