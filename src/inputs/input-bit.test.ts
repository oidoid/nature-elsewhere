import {InputBit} from './input-bit'
import {ObjectUtil} from '../utils/object-util'

const bits: ReadonlyArray<InputBit> = ObjectUtil.freeze(
  ObjectUtil.values(InputBit).filter(val => typeof val === 'number')
)

describe('InputBit', () => {
  test.each(bits)('%# bit %p is unique', input =>
    expect(bits.filter(val => input === val)).toHaveLength(1)
  )

  test.each(bits)('%# bit %p is a nonzero power of two', input =>
    expect(Math.log2(input) % 1).toStrictEqual(0)
  )
})
