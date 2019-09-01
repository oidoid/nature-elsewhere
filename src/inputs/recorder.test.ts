import {Input} from './input'
import {InputBit} from './input-bit'
import {InputSource} from './input-source'
import {Recorder} from './recorder'

const LEFT: InputBit = InputBit.LEFT
const RIGHT: InputBit = InputBit.RIGHT
const UP: InputBit = InputBit.UP
const DOWN: InputBit = InputBit.DOWN

const keyboardRight: Input = Object.freeze({
  source: InputSource.KEYBOARD,
  bits: RIGHT
})
const keyboardUp: Input = Object.freeze({
  source: InputSource.KEYBOARD,
  bits: UP
})
const keyboardDown: Input = Object.freeze({
  source: InputSource.KEYBOARD,
  bits: DOWN
})

describe('Recorder', () => {
  test('Inputs are initially inactive and not triggered', () => {
    const subject = Recorder.make()
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP)).toStrictEqual(false)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject)
  })

  test('Recorded inputs are active and triggered', () => {
    const subject = Recorder.make()
    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)
  })

  test('Held input is active but not triggered', () => {
    const subject = Recorder.make()

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(true)

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP)
  })

  test('Recorded inputs are checked from the end', () => {
    const subject = Recorder.make()

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)

    Recorder.record(subject, keyboardDown)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP)).toStrictEqual(false)
    expect(Recorder.equal(subject, DOWN)).toStrictEqual(true)
    expect(Recorder.equal(subject, UP, DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN)

    Recorder.record(subject, keyboardRight)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP)).toStrictEqual(false)
    expect(Recorder.equal(subject, DOWN)).toStrictEqual(false)
    expect(Recorder.equal(subject, RIGHT)).toStrictEqual(true)
    expect(Recorder.equal(subject, DOWN, RIGHT)).toStrictEqual(true)
    expect(Recorder.equal(subject, UP, DOWN, RIGHT)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN, RIGHT)
  })

  test('Simultaneous recorded input bits are active and triggered', () => {
    const subject = Recorder.make()
    Recorder.record(subject, {source: InputSource.KEYBOARD, bits: UP | DOWN})
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP | DOWN)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP | DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP | DOWN)
  })

  test('Short recorded combo is active and triggered', () => {
    const subject = Recorder.make()
    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    Recorder.record(subject, keyboardDown)
    Recorder.update(subject, 1)
    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP, DOWN, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP, DOWN, UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN, UP)
  })

  test('Long recorded combo is active and triggered', () => {
    const subject = Recorder.make()

    const combo = [UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT]
    combo.forEach(bits => {
      // Record zero so that all keys are repeated instead of held. E.g., UP, UP
      // is recorded as two inputs instead of one.
      Recorder.update(subject, 1)
      Recorder.record(subject, {source: InputSource.KEYBOARD, bits})
      Recorder.update(subject, 1)
    })

    expect(Recorder.equal(subject, ...combo)).toStrictEqual(true)
    expect(Recorder.triggered(subject, ...combo)).toStrictEqual(true)
    expectKeyboardCombo(subject, ...combo)
  })

  test('Combo is inactive and not triggered', () => {
    const subject = Recorder.make()
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP, DOWN, UP)).toStrictEqual(false)
    expect(Recorder.triggered(subject, UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject)
  })

  test('Recorded around the world combo is active and triggered', () => {
    const subject = Recorder.make()
    // prettier-ignore
    const combo = [
      UP, UP | LEFT, LEFT, LEFT | DOWN, DOWN, DOWN | RIGHT, RIGHT, UP | RIGHT
    ]

    combo.forEach(bits => {
      // Inputs are always active with no pause in between.
      Recorder.record(subject, {source: InputSource.KEYBOARD, bits})
      Recorder.update(subject, 1)
    })

    expect(Recorder.equal(subject, ...combo)).toStrictEqual(true)
    expect(Recorder.triggered(subject, ...combo)).toStrictEqual(true)
    expectKeyboardCombo(subject, ...combo)
  })

  test('Recorded combo expired', () => {
    const subject = Recorder.make()

    expect(Recorder.equal(subject, UP)).toStrictEqual(false)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(false)
    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(true)

    Recorder.record(subject, keyboardDown)
    Recorder.update(subject, 1000)
    expect(Recorder.equal(subject, UP, DOWN)).toStrictEqual(false)
    expect(Recorder.triggered(subject, UP, DOWN)).toStrictEqual(false)
    expect(Recorder.equal(subject, DOWN)).toStrictEqual(true)
    expect(Recorder.triggered(subject, DOWN)).toStrictEqual(true)

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP, DOWN, UP)).toStrictEqual(false)
    expect(Recorder.triggered(subject, UP, DOWN, UP)).toStrictEqual(false)
    expect(Recorder.equal(subject, DOWN, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, DOWN, UP)).toStrictEqual(true)
    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, DOWN, UP)
  })

  test('Combo missed', () => {
    const subject = Recorder.make()

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)

    Recorder.record(subject, keyboardRight)
    Recorder.update(subject, 1)

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)

    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(true)
    expect(Recorder.equal(subject, UP, DOWN, UP)).toStrictEqual(false)
    expect(Recorder.triggered(subject, UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP, RIGHT, UP)
  })

  test('Unreleased held and expired combo is active but not triggered', () => {
    const subject = Recorder.make()

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)

    Recorder.record(subject, keyboardDown)
    Recorder.update(subject, 1)

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1)

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1000)
    expect(Recorder.equal(subject, UP, DOWN, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP, DOWN, UP)

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1000)
    expect(Recorder.equal(subject, UP, DOWN, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP, DOWN, UP)
  })

  test('Held and expired', () => {
    const subject = Recorder.make()

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1000)
    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)
  })

  test('Held and expired, changed, held and expired', () => {
    const subject = Recorder.make()

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1000)

    Recorder.record(subject, keyboardDown)
    Recorder.update(subject, 1)
    expect(Recorder.equal(subject, UP, DOWN)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP, DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN)

    Recorder.record(subject, keyboardUp)
    Recorder.update(subject, 1000)
    expect(Recorder.equal(subject, UP)).toStrictEqual(true)
    expect(Recorder.triggered(subject, UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)
  })

  test('Repeated input from single source overwrites previous', () => {
    const subject = Recorder.make()

    Recorder.record(subject, keyboardUp)
    Recorder.record(subject, keyboardDown)
    Recorder.update(subject, 1)

    expect(Recorder.equal(subject, DOWN)).toStrictEqual(true)
    expect(Recorder.triggered(subject, DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, DOWN)
  })

  test('Multiple input sources are coalesced', () => {
    const subject = Recorder.make()

    Recorder.record(subject, {source: InputSource.GAMEPAD, bits: DOWN})
    Recorder.record(subject, keyboardUp)
    Recorder.record(subject, {
      source: InputSource.POINTER_PICK,
      bits: InputBit.PICK
    })
    Recorder.update(subject, 1)

    expect(Recorder.equal(subject, DOWN | UP | InputBit.PICK)).toStrictEqual(
      true
    )
    expect(
      Recorder.triggered(subject, DOWN | UP | InputBit.PICK)
    ).toStrictEqual(true)
    expect(subject.combo).toStrictEqual([
      {
        [InputSource.GAMEPAD]: {source: InputSource.GAMEPAD, bits: DOWN},
        [InputSource.KEYBOARD]: {source: InputSource.KEYBOARD, bits: UP},
        [InputSource.POINTER_PICK]: {
          source: InputSource.POINTER_PICK,
          bits: InputBit.PICK
        }
      }
    ])
  })
})

function expectKeyboardCombo(
  subject: Recorder,
  ...inputs: readonly InputBit[]
): void {
  const source = InputSource.KEYBOARD
  const combo = inputs.map(bits => ({[source]: {source, bits}}))
  expect(subject.combo).toStrictEqual(combo)
}
