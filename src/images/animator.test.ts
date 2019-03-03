import {Animator} from './animator'
import {Aseprite} from '../parsers/aseprite'
import {Atlas} from './atlas'
import {ObjectUtil} from '../utils/object-util'

describe('step()', () => {
  test('No cels', () => {
    const animation = {
      size: {w: 0, h: 0},
      cels: [],
      duration: 0,
      direction: Atlas.AnimationDirection.FORWARD
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
      direction: Atlas.AnimationDirection.FORWARD
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
      direction: Atlas.AnimationDirection.FORWARD
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
      direction: Atlas.AnimationDirection.FORWARD
    }
    const subject = new Animator(animation)
    subject.step(1.5)
    expect(subject).toMatchObject({_period: 1, _duration: 0.5})
  })
})

describe('celIndex', () => {
  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
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

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
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
    ReadonlyArray<
      Readonly<[Aseprite.AnimationDirection, number, ReadonlyArray<number>]>
    >
  >[
    [
      Atlas.AnimationDirection.FORWARD,
      0,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      Atlas.AnimationDirection.FORWARD,
      Number.MAX_SAFE_INTEGER,
      [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    ],
    [
      Atlas.AnimationDirection.REVERSE,
      Number.MIN_SAFE_INTEGER,
      [3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0]
    ],
    [
      Atlas.AnimationDirection.REVERSE,
      3,
      [2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3, 2, 1, 0, 3]
    ],
    [
      Atlas.AnimationDirection.PING_PONG,
      -2,
      [3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2]
    ],
    [
      Atlas.AnimationDirection.PING_PONG,
      0,
      [1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2]
    ],
    [
      Atlas.AnimationDirection.PING_PONG,
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

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
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
        [Atlas.AnimationDirection.FORWARD]:   [1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0],
        [Atlas.AnimationDirection.REVERSE]:   [4, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 2, 1, 0],
        [Atlas.AnimationDirection.PING_PONG]: [1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1]
      }
      expect(actual).toStrictEqual(expected[direction])
    }
  )

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
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
        [Atlas.AnimationDirection.FORWARD]:   [0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0],
        [Atlas.AnimationDirection.REVERSE]:   [0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 4, 4, 3, 3, 2, 2, 1, 1, 0],
        [Atlas.AnimationDirection.PING_PONG]: [0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 2, 2, 1]
      }
      expect(actual).toStrictEqual(expected[direction])
    }
  )

  test.each(ObjectUtil.values(Atlas.AnimationDirection))(
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
        [Atlas.AnimationDirection.FORWARD]:   [0, 1, 2, 3, 4, 0, 1, 2, 3, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 1],
        [Atlas.AnimationDirection.REVERSE]:   [0, 4, 3, 2, 1, 0, 4, 3, 2, 2, 1, 0, 4, 3, 2, 1, 0, 4, 3, 3, 2, 1, 0, 4, 3, 2, 1, 0, 4, 4],
        [Atlas.AnimationDirection.PING_PONG]: [0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 2]
      }
      expect(actual).toStrictEqual(expected[direction])
    }
  )
})
