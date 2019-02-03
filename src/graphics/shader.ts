import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'

const littleEndian: boolean = new Int8Array(new Int16Array([1]).buffer)[0] === 1

const I16: number = WebGLRenderingContext.SHORT
const I8: number = WebGLRenderingContext.BYTE
const U8: number = WebGLRenderingContext.UNSIGNED_BYTE

export type Attribute = typeof layout.perInstance.attributes[number]

export const layout = {
  perVertex: {
    length: 2,
    stride: 4,
    divisor: 0,
    attributes: [{type: I16, name: 'uv', length: 2, offset: 0}]
  },
  perInstance: {
    length: 17,
    stride: 31 + 1,
    divisor: 1,
    attributes: [
      {type: I16, name: 'source', length: 4, offset: 0},
      {type: I16, name: 'target', length: 4, offset: 8},
      {type: I16, name: 'mask', length: 4, offset: 16},
      {type: I8, name: 'offset', length: 2, offset: 24},
      {type: I16, name: 'scale', length: 2, offset: 26},
      {type: U8, name: 'palette', length: 1, offset: 30}
    ]
  }
}

export function newInstanceBuffer(length: number): ArrayBuffer {
  return new ArrayBuffer(layout.perInstance.stride * length)
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
