import {InputBit} from '../input-bit'
import {InputSource} from '../input-source'
import {KeyboardAdapter} from './keyboard-adapter'

const UP: InputBit = InputBit.UP
const DOWN: InputBit = InputBit.DOWN

describe('KeyboardAdapter', () => {
  test('Source is keyboard', () => {
    const subject = new KeyboardAdapter()
    expect(subject.toInput().source).toStrictEqual(InputSource.KEYBOARD)
  })

  test('No inputs initially set', () => {
    const subject = new KeyboardAdapter()
    expect(subject.toInput().bits).toStrictEqual(0)
  })

  test('A set input is active', () => {
    const subject = new KeyboardAdapter()
    subject.adapt(UP, true)
    expect(subject.toInput().bits).toStrictEqual(UP)
  })

  test('An unset input is inactive', () => {
    const subject = new KeyboardAdapter()
    subject.adapt(UP, true)
    subject.adapt(UP, false)
    expect(subject.toInput().bits).toStrictEqual(0)
  })

  test('Set inputs are aggregated', () => {
    const subject = new KeyboardAdapter()
    subject.adapt(UP, true)
    subject.adapt(DOWN, true)
    expect(subject.toInput().bits).toStrictEqual(UP | DOWN)
  })

  test('Unset inputs do not change other inputs', () => {
    const subject = new KeyboardAdapter()
    subject.adapt(UP, true)
    subject.adapt(DOWN, true)
    subject.adapt(UP, false)
    expect(subject.toInput().bits).toStrictEqual(DOWN)
  })

  test('A reset input is cleared', () => {
    const subject = new KeyboardAdapter()
    subject.adapt(UP, true)
    subject.reset()
    expect(subject.toInput().bits).toStrictEqual(0)
  })
})
