import {ShaderConfig} from './shader-config'
import {NumberUtil} from '../../math/number-util'
import {ShaderLayout} from './shader-layout'

const dataTypeSize: Readonly<Record<GLDataType, number>> = Object.freeze({
  BYTE: 1,
  UNSIGNED_BYTE: 1,
  SHORT: 2,
  UNSIGNED_SHORT: 2,
  INT: 4,
  UNSIGNED_INT: 4,
  FLOAT: 4
})

export namespace ShaderLayoutParser {
  export function parse(config: ShaderConfig): ShaderLayout {
    return {
      uniforms: config.uniforms,
      perVertex: parseAttributes(0, config.perVertex),
      perInstance: parseAttributes(1, config.perInstance)
    }
  }
}

function parseAttributes(
  divisor: number,
  configs: readonly ShaderConfig.Attribute[]
): ShaderLayout.AttributeBuffer {
  const attributes = configs.reduce(reduceAttributeVariable, [])
  const maxDataTypeSize = attributes
    .map(({type}) => dataTypeSize[type])
    .reduce((max, val) => Math.max(max, val), 0)
  const size = nextAttributeOffset(attributes[attributes.length - 1])
  return {
    len: attributes.reduce((sum, {len}) => sum + len, 0),
    stride: NumberUtil.ceilMultiple(maxDataTypeSize, size),
    divisor,
    attributes
  }
}

function reduceAttributeVariable(
  layouts: readonly ShaderLayout.Attribute[],
  {type, name, len}: ShaderConfig.Attribute,
  index: number
): readonly ShaderLayout.Attribute[] {
  const offset = index ? nextAttributeOffset(layouts[index - 1]) : 0
  return layouts.concat({type: <GLDataType>type, name, len, offset})
}

function nextAttributeOffset({
  offset,
  type,
  len
}: ShaderLayout.Attribute): number {
  return offset + dataTypeSize[type] * len
}
