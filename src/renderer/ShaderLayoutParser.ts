import {NumberUtil} from '../math/NumberUtil'
import {ShaderLayout} from './ShaderLayout'
import {ShaderLayoutConfig} from './ShaderLayoutConfig'

enum DataTypeSize {
  BYTE = 1,
  UNSIGNED_BYTE = 1,
  SHORT = 2,
  UNSIGNED_SHORT = 2,
  INT = 4,
  UNSIGNED_INT = 4,
  FLOAT = 4
}

export namespace ShaderLayoutParser {
  export const parse = (config: ShaderLayoutConfig): ShaderLayout => ({
    uniforms: config.uniforms,
    perVertex: parseAttributes(0, config.perVertex),
    perInstance: parseAttributes(1, config.perInstance)
  })
}

const parseAttributes = (
  divisor: number,
  configs: readonly ShaderLayoutConfig.Attribute[]
): ShaderLayout.AttributeBuffer => {
  const attributes = configs.reduce(reduceAttributeVariable, [])
  const maxDataTypeSize = attributes
    .map(({type}) => DataTypeSize[type])
    .reduce((max, val) => Math.max(max, val), 0)
  const size = nextAttributeOffset(attributes[attributes.length - 1])
  return {
    len: attributes.reduce((sum, {len}) => sum + len, 0),
    stride: NumberUtil.ceilMultiple(maxDataTypeSize, size),
    divisor,
    attributes
  }
}

const reduceAttributeVariable = (
  layouts: readonly ShaderLayout.Attribute[],
  {type, name, len}: ShaderLayoutConfig.Attribute,
  index: number
): readonly ShaderLayout.Attribute[] => {
  const offset = index ? nextAttributeOffset(layouts[index - 1]) : 0
  return layouts.concat({type: <GLDataType>type, name, len, offset})
}

const nextAttributeOffset = (attr: ShaderLayout.Attribute): number =>
  attr.offset + DataTypeSize[attr.type] * attr.len
