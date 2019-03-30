import {InputBit} from './input-bit'
import {InputSource} from './input-source'
import {Recorder} from './recorder'

const LEFT: InputBit = InputBit.LEFT
const RIGHT: InputBit = InputBit.RIGHT
const UP: InputBit = InputBit.UP
const DOWN: InputBit = InputBit.DOWN

const keyboardRight = {source: InputSource.KEYBOARD, bits: RIGHT}
const keyboardUp = {source: InputSource.KEYBOARD, bits: UP}
const keyboardDown = {source: InputSource.KEYBOARD, bits: DOWN}

describe('Recorder', () => {
  test('Inputs are initially inactive and not triggered', () => {
    const subject = new Recorder()
    subject.update(1)
    expect(subject.equal(UP)).toStrictEqual(false)
    expect(subject.triggered(UP)).toStrictEqual(false)
    expectKeyboardCombo(subject)
  })

  test('Recorded inputs are active and triggered', () => {
    const subject = new Recorder()
    subject.record(keyboardUp)
    subject.update(1)
    expect(subject.equal(UP)).toStrictEqual(true)
    expect(subject.triggered(UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)
  })

  test('Held input is active but not triggered', () => {
    const subject = new Recorder()

    subject.record(keyboardUp)
    subject.update(1)
    expect(subject.triggered(UP)).toStrictEqual(true)

    subject.record(keyboardUp)
    subject.update(1)
    expect(subject.equal(UP)).toStrictEqual(true)
    expect(subject.triggered(UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP)
  })

  test('Recorded inputs are checked from the end', () => {
    const subject = new Recorder()

    subject.record(keyboardUp)
    subject.update(1)
    expect(subject.equal(UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)

    subject.record(keyboardDown)
    subject.update(1)
    expect(subject.equal(UP)).toStrictEqual(false)
    expect(subject.equal(DOWN)).toStrictEqual(true)
    expect(subject.equal(UP, DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN)

    subject.record(keyboardRight)
    subject.update(1)
    expect(subject.equal(UP)).toStrictEqual(false)
    expect(subject.equal(DOWN)).toStrictEqual(false)
    expect(subject.equal(RIGHT)).toStrictEqual(true)
    expect(subject.equal(DOWN, RIGHT)).toStrictEqual(true)
    expect(subject.equal(UP, DOWN, RIGHT)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN, RIGHT)
  })

  test('Simultaneous recorded input bits are active and triggered', () => {
    const subject = new Recorder()
    subject.record({source: InputSource.KEYBOARD, bits: UP | DOWN})
    subject.update(1)
    expect(subject.equal(UP | DOWN)).toStrictEqual(true)
    expect(subject.triggered(UP | DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP | DOWN)
  })

  test('Short recorded combo is active and triggered', () => {
    const subject = new Recorder()
    subject.record(keyboardUp)
    subject.update(1)
    subject.record(keyboardDown)
    subject.update(1)
    subject.record(keyboardUp)
    subject.update(1)
    expect(subject.equal(UP, DOWN, UP)).toStrictEqual(true)
    expect(subject.triggered(UP, DOWN, UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN, UP)
  })

  test('Long recorded combo is active and triggered', () => {
    const subject = new Recorder()

    const combo = [UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT]
    combo.forEach(bits => {
      // Record zero so that all keys are repeated instead of held. E.g., UP, UP
      // is recorded as two inputs instead of one.
      subject.update(1)
      subject.record({source: InputSource.KEYBOARD, bits})
      subject.update(1)
    })

    expect(subject.equal(...combo)).toStrictEqual(true)
    expect(subject.triggered(...combo)).toStrictEqual(true)
    expectKeyboardCombo(subject, ...combo)
  })

  test('Combo is inactive and not triggered', () => {
    const subject = new Recorder()
    subject.update(1)
    expect(subject.equal(UP, DOWN, UP)).toStrictEqual(false)
    expect(subject.triggered(UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject)
  })

  test('Recorded around the world combo is active and triggered', () => {
    const subject = new Recorder()
    // prettier-ignore
    const combo = [
      UP, UP | LEFT, LEFT, LEFT | DOWN, DOWN, DOWN | RIGHT, RIGHT, UP | RIGHT
    ]

    combo.forEach(bits => {
      // Inputs are always active with no pause in between.
      subject.record({source: InputSource.KEYBOARD, bits})
      subject.update(1)
    })

    expect(subject.equal(...combo)).toStrictEqual(true)
    expect(subject.triggered(...combo)).toStrictEqual(true)
    expectKeyboardCombo(subject, ...combo)
  })

  test('Recorded combo expired', () => {
    const subject = new Recorder()

    expect(subject.equal(UP)).toStrictEqual(false)
    expect(subject.triggered(UP)).toStrictEqual(false)
    subject.record(keyboardUp)
    subject.update(1)
    expect(subject.equal(UP)).toStrictEqual(true)
    expect(subject.triggered(UP)).toStrictEqual(true)

    subject.record(keyboardDown)
    subject.update(1000)
    expect(subject.equal(UP, DOWN)).toStrictEqual(false)
    expect(subject.triggered(UP, DOWN)).toStrictEqual(false)
    expect(subject.equal(DOWN)).toStrictEqual(true)
    expect(subject.triggered(DOWN)).toStrictEqual(true)

    subject.record(keyboardUp)
    subject.update(1)
    expect(subject.equal(UP, DOWN, UP)).toStrictEqual(false)
    expect(subject.triggered(UP, DOWN, UP)).toStrictEqual(false)
    expect(subject.equal(DOWN, UP)).toStrictEqual(true)
    expect(subject.triggered(DOWN, UP)).toStrictEqual(true)
    expect(subject.equal(UP)).toStrictEqual(true)
    expect(subject.triggered(UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, DOWN, UP)
  })

  test('Combo missed', () => {
    const subject = new Recorder()

    subject.record(keyboardUp)
    subject.update(1)

    subject.record(keyboardRight)
    subject.update(1)

    subject.record(keyboardUp)
    subject.update(1)

    expect(subject.equal(UP)).toStrictEqual(true)
    expect(subject.triggered(UP)).toStrictEqual(true)
    expect(subject.equal(UP, DOWN, UP)).toStrictEqual(false)
    expect(subject.triggered(UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP, RIGHT, UP)
  })

  test('Unreleased held and expired combo is active but not triggered', () => {
    const subject = new Recorder()

    subject.record(keyboardUp)
    subject.update(1)

    subject.record(keyboardDown)
    subject.update(1)

    subject.record(keyboardUp)
    subject.update(1)

    subject.record(keyboardUp)
    subject.update(1000)
    expect(subject.equal(UP, DOWN, UP)).toStrictEqual(true)
    expect(subject.triggered(UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP, DOWN, UP)

    subject.record(keyboardUp)
    subject.update(1000)
    expect(subject.equal(UP, DOWN, UP)).toStrictEqual(true)
    expect(subject.triggered(UP, DOWN, UP)).toStrictEqual(false)
    expectKeyboardCombo(subject, UP, DOWN, UP)
  })

  test('Held and expired', () => {
    const subject = new Recorder()

    subject.record(keyboardUp)
    subject.update(1000)
    expect(subject.equal(UP)).toStrictEqual(true)
    expect(subject.triggered(UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)
  })

  test('Held and expired, changed, held and expired', () => {
    const subject = new Recorder()

    subject.record(keyboardUp)
    subject.update(1000)

    subject.record(keyboardDown)
    subject.update(1)
    expect(subject.equal(UP, DOWN)).toStrictEqual(true)
    expect(subject.triggered(UP, DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP, DOWN)

    subject.record(keyboardUp)
    subject.update(1000)
    expect(subject.equal(UP)).toStrictEqual(true)
    expect(subject.triggered(UP)).toStrictEqual(true)
    expectKeyboardCombo(subject, UP)
  })

  test('Repeated input from single source overwrites previous', () => {
    const subject = new Recorder()

    subject.record(keyboardUp)
    subject.record(keyboardDown)
    subject.update(1)

    expect(subject.equal(DOWN)).toStrictEqual(true)
    expect(subject.triggered(DOWN)).toStrictEqual(true)
    expectKeyboardCombo(subject, DOWN)
  })

  test('Multiple input sources are coalesced', () => {
    const subject = new Recorder()

    subject.record({source: InputSource.GAMEPAD, bits: DOWN})
    subject.record(keyboardUp)
    subject.record({source: InputSource.MOUSE_PICK, bits: InputBit.PICK})
    subject.update(1)

    expect(subject.equal(DOWN | UP | InputBit.PICK)).toStrictEqual(true)
    expect(subject.triggered(DOWN | UP | InputBit.PICK)).toStrictEqual(true)
    expect(subject.combo()).toStrictEqual([
      {
        [InputSource.GAMEPAD]: {source: InputSource.GAMEPAD, bits: DOWN},
        [InputSource.KEYBOARD]: {source: InputSource.KEYBOARD, bits: UP},
        [InputSource.MOUSE_PICK]: {
          source: InputSource.MOUSE_PICK,
          bits: InputBit.PICK
        }
      }
    ])
  })
})

function expectKeyboardCombo(subject: Recorder, ...inputs: readonly InputBit[]): void {
  const source = InputSource.KEYBOARD
  const combo = inputs.map(bits => ({[source]: {source, bits}}))
  expect(subject.combo()).toStrictEqual(combo)
}
