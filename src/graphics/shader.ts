import {Atlas} from '../images/atlas'
import {GL} from './gl-util'
import {Image} from '../images/image'
import {NumberUtil} from '../utils/number-util'
import {ObjectUtil} from '../utils/object-util'

export namespace Shader {
  export enum Variable {
    // Uniforms
    ATLAS = 'atlas',
    ATLAS_SIZE = 'atlasSize',
    PALETTE = 'palette',
    PALETTE_SIZE = 'paletteSize',
    PROJECTION = 'projection',

    // Per vertex attributes
    UV = 'uv',

    // Per instance attributes
    SOURCE = 'source',
    TARGET = 'target',
    OFFSET = 'offset',
    SCALE = 'scale',
    MASK_SOURCE = 'maskSource',
    MASK_OFFSET = 'maskOffset',
    PALETTE_INDEX = 'paletteIndex'
  }

  export interface AttributeLayout {
    readonly perVertex: DivisorLayout
    readonly perInstance: DivisorLayout
  }

  export interface DivisorLayout {
    readonly length: number
    readonly stride: number
    readonly divisor: number
    readonly attributes: ReadonlyArray<Attribute>
  }

  export interface Attribute {
    readonly type: number
    readonly name: Shader.Variable
    readonly length: number
    readonly offset: number
  }

  type PartialAttribute = Omit<Attribute, 'offset'>

  const littleEndian: boolean =
    new Int8Array(new Int16Array([1]).buffer)[0] === 1

  const U8: number = GL.UNSIGNED_BYTE
  const I8: number = GL.BYTE
  const I16: number = GL.SHORT
  const sizeOfType: Readonly<Record<number, number>> = ObjectUtil.freeze({
    [U8]: 1,
    [I8]: 1,
    [I16]: 2
  })

  export const layout: AttributeLayout = ObjectUtil.freeze({
    perVertex: newDivisorLayout(0, {name: Variable.UV, type: I16, length: 2}),
    perInstance: newDivisorLayout(
      1,
      {name: Variable.SOURCE, type: I16, length: 4},
      {name: Variable.TARGET, type: I16, length: 4},
      {name: Variable.OFFSET, type: I8, length: 2},
      {name: Variable.SCALE, type: I16, length: 2},
      {name: Variable.MASK_SOURCE, type: I16, length: 4},
      {name: Variable.MASK_OFFSET, type: I8, length: 2},
      {name: Variable.PALETTE_INDEX, type: U8, length: 1}
    )
  })

  function newDivisorLayout(
    divisor: number,
    ...partialAttributes: PartialAttribute[]
  ): DivisorLayout {
    const attributes = partialAttributes.reduce(reducePartialAttribute, [])
    const maxSize = attributes.reduce(
      (max, {type}) => Math.max(sizeOfType[type], max),
      0
    )
    return {
      length: attributes.reduce((sum, {length}) => sum + length, 0),
      stride: NumberUtil.roundMultiple(
        maxSize,
        nextOffset(attributes[attributes.length - 1])
      ),
      divisor,
      attributes
    }
  }

  function reducePartialAttribute(
    attributes: ReadonlyArray<Attribute>,
    {type, name, length}: PartialAttribute,
    index: number
  ): ReadonlyArray<Attribute> {
    return attributes.concat({
      type,
      name,
      length,
      offset: index ? nextOffset(attributes[index - 1]) : 0
    })
  }

  function nextOffset(attribute: Attribute): number {
    return attribute.offset + sizeOfType[attribute.type] * attribute.length
  }

  export function newInstanceBuffer(length: number): DataView {
    return new DataView(new ArrayBuffer(layout.perInstance.stride * length))
  }

  export function packInstance(
    {animations}: Atlas.Definition,
    dataView: DataView,
    index: number,
    image: Image
  ): void {
    const animation = animations[image.animationID()]
    const maskAnimation = animations[image.maskAnimationID()]
    const i = index * layout.perInstance.stride
    dataView.setInt16(
      i + 0,
      animation.cels[image.cel()].position.x,
      littleEndian
    )
    dataView.setInt16(
      i + 2,
      animation.cels[image.cel()].position.y,
      littleEndian
    )
    dataView.setInt16(i + 4, animation.size.w, littleEndian)
    dataView.setInt16(i + 6, animation.size.h, littleEndian)
    dataView.setInt16(i + 8, image.target().x, littleEndian)
    dataView.setInt16(i + 10, image.target().y, littleEndian)
    dataView.setInt16(i + 12, image.target().w, littleEndian)
    dataView.setInt16(i + 14, image.target().h, littleEndian)
    dataView.setInt8(i + 16, image.offset().x)
    dataView.setInt8(i + 17, image.offset().y)
    dataView.setInt16(i + 18, image.scale().x, littleEndian)
    dataView.setInt16(i + 20, image.scale().y, littleEndian)
    dataView.setInt16(
      i + 22,
      maskAnimation.cels[image.maskCel()].position.x,
      littleEndian
    )
    dataView.setInt16(
      i + 24,
      maskAnimation.cels[image.maskCel()].position.y,
      littleEndian
    )
    dataView.setInt16(i + 26, maskAnimation.size.w, littleEndian)
    dataView.setInt16(i + 28, maskAnimation.size.h, littleEndian)
    dataView.setInt16(i + 30, image.maskOffset().x, littleEndian)
    dataView.setInt16(i + 31, image.maskOffset().y, littleEndian)
    dataView.setUint8(i + 32, image.palette())
  }
}
