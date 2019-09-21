import {ObjectUtil} from './ObjectUtil'

export namespace TestUtil {
  export function testValuesAreUnique(obj: object, typeName: string): void {
    const vals = ObjectUtil.values(obj)
    test.each(vals)(`%# ${typeName} %p is unique`, val =>
      expect(vals.filter(rhs => val === rhs)).toHaveLength(1)
    )
  }

  export function testValuesArePositivePowerOfTwo(
    vals: readonly number[]
  ): void {
    test.each(vals)('%# val %p is a nonzero power of two', val =>
      expectPositivePowerOfTwo(val)
    )
  }

  export function expectPositivePowerOfTwo(val: number): void {
    expect(Math.log2(val) % 1).toStrictEqual(0)
  }
}
