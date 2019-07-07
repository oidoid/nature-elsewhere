import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'

export namespace Shader {
  const littleEndian: boolean =
    new Int8Array(new Int16Array([1]).buffer)[0] === 1

  export function newInstanceBuffer(
    layout: ShaderLayout,
    length: number
  ): DataView {
    return new DataView(new ArrayBuffer(layout.perInstance.stride * length))
  }

  export function packInstance(
    layout: ShaderLayout,
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
    dataView.setInt8(i + 30, image.maskOffset().x)
    dataView.setInt8(i + 31, image.maskOffset().y)
    dataView.setUint8(i + 32, image.palette())
  }
}
