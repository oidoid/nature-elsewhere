import * as number from '../utils/number'
import * as object from '../utils/object'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'

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
  readonly name: string
  readonly length: number
  readonly offset: number
}

type PartialAttribute = Omit<Attribute, 'offset'>

const littleEndian: boolean = new Int8Array(new Int16Array([1]).buffer)[0] === 1

const U8: number = WebGLRenderingContext.UNSIGNED_BYTE
const I8: number = WebGLRenderingContext.BYTE
const I16: number = WebGLRenderingContext.SHORT
const sizeOfType: Readonly<Record<number, number>> = object.freeze({
  [U8]: 1,
  [I8]: 1,
  [I16]: 2
})

export const layout: AttributeLayout = object.freeze({
  perVertex: newDivisorLayout(0, {name: 'uv', type: I16, length: 2}),
  perInstance: newDivisorLayout(
    1,
    {name: 'source', type: I16, length: 4},
    {name: 'target', type: I16, length: 4},
    {name: 'mask', type: I16, length: 4},
    {name: 'offset', type: I8, length: 2},
    {name: 'scale', type: I16, length: 2},
    {name: 'palette', type: U8, length: 1}
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
    stride: number.roundMultiple(
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
  {animations}: AtlasDefinition,
  dataView: DataView,
  index: number,
  image: Image
): void {
  const animation = animations[image.animationID()]
  const maskAnimation = animations[image.maskAnimationID()]
  const i = index * layout.perInstance.stride
  dataView.setInt16(i + 0, animation.cels[image.cel()].position.x, littleEndian)
  dataView.setInt16(i + 2, animation.cels[image.cel()].position.y, littleEndian)
  dataView.setInt16(i + 4, animation.size.w, littleEndian)
  dataView.setInt16(i + 6, animation.size.h, littleEndian)
  dataView.setInt16(i + 8, image.target().x, littleEndian)
  dataView.setInt16(i + 10, image.target().y, littleEndian)
  dataView.setInt16(i + 12, image.target().w, littleEndian)
  dataView.setInt16(i + 14, image.target().h, littleEndian)
  dataView.setInt16(
    i + 16,
    maskAnimation.cels[image.maskCel()].position.x,
    littleEndian
  )
  dataView.setInt16(
    i + 18,
    maskAnimation.cels[image.maskCel()].position.y,
    littleEndian
  )
  dataView.setInt16(i + 20, maskAnimation.size.w, littleEndian)
  dataView.setInt16(i + 22, maskAnimation.size.h, littleEndian)
  dataView.setInt8(i + 24, image.offset().x)
  dataView.setInt8(i + 25, image.offset().y)
  dataView.setInt16(i + 26, image.scale().x, littleEndian)
  dataView.setInt16(i + 28, image.scale().y, littleEndian)
  dataView.setUint8(i + 30, image.palette())
}
