import {InputMask} from './input-mask'
import {Recorder} from './recorder'

const LEFT = InputMask.LEFT
const RIGHT = InputMask.RIGHT
const UP = InputMask.UP
const DOWN = InputMask.DOWN

const inputs: InputMask[] = Object.values(InputMask).filter(
  val => typeof val === 'number'
)
type InputMethod = Exclude<
  keyof Recorder,
  'write' | 'set' | 'read' | 'combo' | 'active'
>
type MaskMethod = Readonly<{method: InputMethod; mask: InputMask}>

const maskMethods: MaskMethod[] = [
  {mask: LEFT, method: 'left'},
  {mask: RIGHT, method: 'right'},
  {mask: UP, method: 'up'},
  {mask: DOWN, method: 'down'},
  {mask: InputMask.MENU, method: 'menu'},
  {mask: InputMask.DEBUG_CONTEXT_LOSS, method: 'debugContextLoss'}
]

describe('Mask', () => {
  test.each(inputs)('%# Mask %p is unique', (input: InputMask) =>
    expect(inputs.filter((val: InputMask) => input === val)).toHaveLength(1)
  )

  test.each(inputs)(
    '%# Mask %p is a nonzero power of two',
    (input: InputMask) => expect(Math.log2(input) % 1).toStrictEqual(0)
  )
})

describe('State', () => {
  test.each(maskMethods)('%# no input %p', ({method}: MaskMethod) => {
    const subject = new Recorder()
    subject.read(1)
    expect(subject[method]()).toStrictEqual(false)
    expect(subject[method](true)).toStrictEqual(false)
    expect(subject.combo()).toStrictEqual(true)
    expect(subject.combo(true)).toStrictEqual(false)
  })

  test.each(maskMethods)('%# tapped input %p', ({mask, method}: MaskMethod) => {
    const subject = new Recorder()
    subject.set(mask, true)
    subject.read(1)
    expect(subject[method]()).toStrictEqual(true)
    expect(subject[method](true)).toStrictEqual(true)
    expect(subject.combo(false, mask)).toStrictEqual(true)
    expect(subject.combo(true, mask)).toStrictEqual(true)
  })

  test.each(maskMethods)(
    '%# old tapped input %p',
    ({mask, method}: MaskMethod) => {
      const subject = new Recorder()
      subject.set(mask, true)
      subject.read(1000)
      expect(subject[method]()).toStrictEqual(true)
      expect(subject[method](true)).toStrictEqual(true)
      expect(subject.combo(false, mask)).toStrictEqual(true)
      expect(subject.combo(true, mask)).toStrictEqual(true)
    }
  )

  test.each(maskMethods)('%# held input %p', ({mask, method}: MaskMethod) => {
    const subject = new Recorder()
    subject.set(mask, true)
    subject.read(1)
    subject.write()
    subject.read(1)
    expect(subject[method]()).toStrictEqual(true)
    expect(subject[method](true)).toStrictEqual(false)
    expect(subject.combo(false, mask)).toStrictEqual(true)
    expect(subject.combo(true, mask)).toStrictEqual(false)
  })

  test.each(maskMethods)(
    '%# long held input %p',
    ({mask, method}: MaskMethod) => {
      const subject = new Recorder()
      subject.set(mask, true)
      subject.read(1)
      subject.write()
      subject.read(1000)
      expect(subject[method]()).toStrictEqual(true)
      expect(subject[method](true)).toStrictEqual(false)
      expect(subject.combo(false, mask)).toStrictEqual(true)
      expect(subject.combo(true, mask)).toStrictEqual(false)
    }
  )

  test.each(maskMethods)(
    '%# tapped and released input %p',
    ({mask, method}: MaskMethod) => {
      const subject = new Recorder()
      subject.set(mask, true)
      subject.read(1)
      subject.write()
      subject.set(mask, false)
      subject.read(1)
      expect(subject[method]()).toStrictEqual(false)
      expect(subject[method](true)).toStrictEqual(false)
      expect(subject.combo(false, mask)).toStrictEqual(true)
      expect(subject.combo(true, mask)).toStrictEqual(false)
    }
  )

  test.each(maskMethods)(
    '%# toggled 3x input %p',
    ({mask, method}: MaskMethod) => {
      const subject = new Recorder()
      subject.set(mask, true)
      subject.read(1)
      subject.write()
      subject.set(mask, false)
      subject.read(1)
      subject.write()
      subject.set(mask, true)
      subject.read(1)
      expect(subject[method]()).toStrictEqual(true)
      expect(subject[method](true)).toStrictEqual(true)
      expect(subject.combo(false, mask, mask)).toStrictEqual(true)
      expect(subject.combo(true, mask, mask)).toStrictEqual(true)
    }
  )

  test('Changed input without release', () => {
    const subject = new Recorder()
    subject.set(UP, true)
    subject.read(1)
    subject.write()
    subject.set(DOWN, true)
    subject.read(1)

    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(false)
    expect(subject.down()).toStrictEqual(true)
    expect(subject.down(true)).toStrictEqual(true)

    expect(subject.combo(false, UP)).toStrictEqual(false)
    expect(subject.combo(true, UP)).toStrictEqual(false)
    expect(subject.combo(false, DOWN)).toStrictEqual(false)
    expect(subject.combo(true, DOWN)).toStrictEqual(false)
    expect(subject.combo(false, UP | DOWN)).toStrictEqual(true)
    expect(subject.combo(true, UP | DOWN)).toStrictEqual(true)
    expect(subject.combo(false, UP, UP | DOWN)).toStrictEqual(true)
    expect(subject.combo(true, UP, UP | DOWN)).toStrictEqual(true)
  })

  test.each(maskMethods)(
    '%# missed input release %p',
    ({mask, method}: MaskMethod) => {
      const subject = new Recorder()
      subject.set(mask, true)
      subject.read(1)
      subject.write()
      subject.set(mask, true)
      subject.read(1)
      expect(subject[method]()).toStrictEqual(true)
      expect(subject[method](true)).toStrictEqual(false)
      expect(subject.combo(false, mask)).toStrictEqual(true)
      expect(subject.combo(true, mask)).toStrictEqual(false)
    }
  )

  test.each(maskMethods)(
    '%# missed input tapped %p',
    ({mask, method}: MaskMethod) => {
      const subject = new Recorder()
      subject.set(mask, true)
      subject.read(1)
      subject.write()
      subject.set(mask, false)
      subject.read(1)
      subject.write()
      subject.set(mask, false)
      subject.read(1)
      expect(subject[method]()).toStrictEqual(false)
      expect(subject[method](true)).toStrictEqual(false)
      expect(subject.combo(false, mask)).toStrictEqual(true)
      expect(subject.combo(true, mask)).toStrictEqual(false)
    }
  )

  test('1x combo', () => {
    const subject = new Recorder()
    subject.set(UP, true)
    subject.read(1)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(true)
    expect(subject.combo(false, UP)).toStrictEqual(true)
    expect(subject.combo(true, UP)).toStrictEqual(true)
  })

  test('2x combo', () => {
    const subject = new Recorder()
    subject.set(UP, true)
    subject.read(1)
    subject.write()
    subject.set(UP, false)
    subject.read(1)
    subject.write()
    subject.set(UP, true)
    subject.read(1)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(true)
    expect(subject.combo(false, UP, UP)).toStrictEqual(true)
    expect(subject.combo(true, UP, UP)).toStrictEqual(true)
  })

  test('Long combo', () => {
    const subject = new Recorder()
    subject.set(UP, true)
    subject.read(100)
    subject.write()
    subject.set(UP, false)
    subject.read(100)
    subject.write()
    subject.set(UP, true)
    subject.read(100)
    subject.write()
    subject.set(UP, false)
    subject.read(100)
    subject.write()
    subject.set(DOWN, true)
    subject.read(100)
    subject.write()
    subject.set(DOWN, false)
    subject.read(100)
    subject.write()
    subject.set(DOWN, true)
    subject.read(100)
    subject.write()
    subject.set(DOWN, false)
    subject.read(100)
    subject.write()
    subject.set(LEFT, true)
    subject.read(100)
    subject.write()
    subject.set(LEFT, false)
    subject.read(100)
    subject.write()
    subject.set(RIGHT, true)
    subject.read(100)
    subject.write()
    subject.set(RIGHT, false)
    subject.read(100)
    subject.write()
    subject.set(LEFT, true)
    subject.read(100)
    subject.write()
    subject.set(LEFT, false)
    subject.read(100)
    subject.write()
    subject.set(RIGHT, true)
    subject.read(100)

    expect(subject.up()).toStrictEqual(false)
    expect(subject.up(true)).toStrictEqual(false)
    expect(subject.down()).toStrictEqual(false)
    expect(subject.down(true)).toStrictEqual(false)
    expect(subject.left()).toStrictEqual(false)
    expect(subject.left(true)).toStrictEqual(false)
    expect(subject.right()).toStrictEqual(true)
    expect(subject.right(true)).toStrictEqual(true)

    const combo = [UP, UP, DOWN, DOWN, LEFT, RIGHT, LEFT, RIGHT]
    expect(subject.combo(false, ...combo)).toStrictEqual(true)
    expect(subject.combo(true, ...combo)).toStrictEqual(true)
  })

  test('After combo', () => {
    const subject = new Recorder()
    subject.set(UP, true)
    subject.read(1)
    subject.write()
    subject.set(UP, false)
    subject.read(1)
    subject.write()
    subject.set(UP, true)
    subject.read(1)
    subject.write()
    subject.set(UP, false)
    subject.read(1)
    expect(subject.up()).toStrictEqual(false)
    expect(subject.up(true)).toStrictEqual(false)
    expect(subject.combo(false, UP, UP)).toStrictEqual(true)
    expect(subject.combo(true, UP, UP)).toStrictEqual(false)
  })

  test('Around the world combo', () => {
    const subject = new Recorder()
    subject.set(UP, true)
    subject.read(1)
    subject.write()
    subject.set(LEFT, true)
    subject.read(1)
    subject.write()
    subject.set(UP, false)
    subject.read(1)
    subject.write()
    subject.set(DOWN, true)
    subject.read(1)
    subject.write()
    subject.set(LEFT, false)
    subject.read(1)
    subject.write()
    subject.set(RIGHT, true)
    subject.read(1)
    subject.write()
    subject.set(DOWN, false)
    subject.read(1)

    expect(subject.up()).toStrictEqual(false)
    expect(subject.up(true)).toStrictEqual(false)
    expect(subject.left()).toStrictEqual(false)
    expect(subject.left(true)).toStrictEqual(false)
    expect(subject.down()).toStrictEqual(false)
    expect(subject.down(true)).toStrictEqual(false)
    expect(subject.right()).toStrictEqual(true)
    expect(subject.right(true)).toStrictEqual(false)

    const combo = [UP, UP | LEFT, LEFT, LEFT | DOWN, DOWN, DOWN | RIGHT, RIGHT]
    expect(subject.combo(false, ...combo)).toStrictEqual(true)
    expect(subject.combo(true, ...combo)).toStrictEqual(true)
  })

  test('Combo missed', () => {
    const subject = new Recorder()
    subject.set(UP, true)
    subject.read(1)
    subject.write()
    subject.set(UP, false)
    subject.read(1000)
    subject.write()
    subject.set(UP, true)
    subject.read(1)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(true)
    expect(subject.combo(false, UP, UP)).toStrictEqual(false)
    expect(subject.combo(true, UP, UP)).toStrictEqual(false)
  })

  test('Combo subset', () => {
    const subject = new Recorder()
    subject.set(DOWN, true)
    subject.read(1)
    subject.write()
    subject.set(DOWN, false)
    subject.read(1)
    subject.write()
    subject.set(UP, true)
    subject.read(1)
    subject.write()
    subject.set(UP, false)
    subject.read(1)
    subject.write()
    subject.set(UP, true)
    subject.read(1)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(true)
    expect(subject.combo(false, DOWN, UP, UP)).toStrictEqual(true)
    expect(subject.combo(true, DOWN, UP, UP)).toStrictEqual(true)
    expect(subject.combo(false, UP, UP)).toStrictEqual(true)
    expect(subject.combo(true, UP, UP)).toStrictEqual(true)
    expect(subject.combo(false, UP)).toStrictEqual(true)
    expect(subject.combo(true, UP)).toStrictEqual(true)
  })

  test('Held combo', () => {
    const subject = new Recorder()
    subject.set(DOWN, true)
    subject.read(1)
    subject.write()
    subject.set(DOWN, false)
    subject.read(1)
    subject.write()
    subject.set(UP, true)
    subject.read(1000)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(true)
    expect(subject.combo(false, DOWN, UP)).toStrictEqual(true)
    expect(subject.combo(true, DOWN, UP)).toStrictEqual(true)
  })

  test('After held combo', () => {
    const subject = new Recorder()
    subject.set(DOWN, true)
    subject.read(1)
    subject.write()
    subject.set(DOWN, false)
    subject.read(1)
    subject.write()
    subject.set(UP, true)
    subject.read(1000)
    subject.write()
    subject.read(1)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(false)
    expect(subject.combo(false, DOWN, UP)).toStrictEqual(true)
    expect(subject.combo(true, DOWN, UP)).toStrictEqual(false)
  })

  test('Long after held combo', () => {
    const subject = new Recorder()
    subject.set(DOWN, true)
    subject.read(1)
    subject.write()
    subject.set(DOWN, false)
    subject.read(1)
    subject.write()
    subject.set(UP, true)
    subject.read(1000)
    subject.write()
    subject.read(1000)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(false)
    expect(subject.combo(false, DOWN, UP)).toStrictEqual(true)
    expect(subject.combo(true, DOWN, UP)).toStrictEqual(false)
  })

  test('Simultaneous input combo', () => {
    const subject = new Recorder()
    subject.set(UP | DOWN, true)
    subject.read(1)
    subject.write()
    subject.set(UP | DOWN, false)
    subject.read(1)
    subject.write()
    subject.set(UP | DOWN, true)
    subject.read(1)
    subject.write()
    subject.set(DOWN, false)
    subject.read(1)
    expect(subject.up()).toStrictEqual(true)
    expect(subject.up(true)).toStrictEqual(false)
    expect(subject.down()).toStrictEqual(false)
    expect(subject.down(true)).toStrictEqual(false)
    expect(subject.combo(false, UP | DOWN, UP | DOWN, UP)).toStrictEqual(true)
    expect(subject.combo(true, UP | DOWN, UP | DOWN, UP)).toStrictEqual(true)
  })
})
