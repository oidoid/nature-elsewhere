import {Image} from '../images/image'
import {Atlas} from '../images/atlas'

export namespace StoreBuffer {
  const littleEndian: boolean =
    new Int8Array(new Int16Array([1]).buffer)[0] === 1

  /** @return The length in bytes. */
  export function size(layout: ShaderLayout, length: number): number {
    return layout.perInstance.stride * length
  }

  /** @param size The buffer length in bytes. */
  export function make(size: number): DataView {
    return new DataView(new ArrayBuffer(size))
  }

  /** Tightly coupled to ShaderLayout and GLSL. */
  export function set(
    layout: ShaderLayout,
    {animations}: Atlas.Definition,
    data: DataView,
    index: number,
    image: Image
  ): void {
    const animation = animations[image.animationID()]
    const maskAnimation = animations[image.maskAnimationID()]
    const i = index * layout.perInstance.stride
    data.setInt16(i + 0, animation.cels[image.cel()].position.x, littleEndian)
    data.setInt16(i + 2, animation.cels[image.cel()].position.y, littleEndian)
    data.setInt16(i + 4, animation.size.w, littleEndian)
    data.setInt16(i + 6, animation.size.h, littleEndian)
    data.setInt16(i + 8, image.target().x, littleEndian)
    data.setInt16(i + 10, image.target().y, littleEndian)
    data.setInt16(i + 12, image.target().w, littleEndian)
    data.setInt16(i + 14, image.target().h, littleEndian)
    data.setInt8(i + 16, image.offset().x)
    data.setInt8(i + 17, image.offset().y)
    data.setInt16(i + 18, image.scale().x, littleEndian)
    data.setInt16(i + 20, image.scale().y, littleEndian)
    data.setInt16(
      i + 22,
      maskAnimation.cels[image.maskCel()].position.x,
      littleEndian
    )
    data.setInt16(
      i + 24,
      maskAnimation.cels[image.maskCel()].position.y,
      littleEndian
    )
    data.setInt16(i + 26, maskAnimation.size.w, littleEndian)
    data.setInt16(i + 28, maskAnimation.size.h, littleEndian)
    data.setInt8(i + 30, image.maskOffset().x)
    data.setInt8(i + 31, image.maskOffset().y)
    data.setUint8(i + 32, image.palette())
  }
}
