import {InputSource} from './input-source'
import {ObjectUtil} from '../utils/object-util'

const sources: ReadonlyArray<InputSource> = ObjectUtil.freeze(
  ObjectUtil.values(InputSource).filter(val => typeof val === 'number')
)

describe('InputSource', () => {
  test.each(sources)('%# source %p is unique', source =>
    expect(sources.filter(val => source === val)).toHaveLength(1)
  )

  test.each(sources)('%# source %p is a nonzero power of two', source =>
    expect(Math.log2(source) % 1).toStrictEqual(0)
  )
})
