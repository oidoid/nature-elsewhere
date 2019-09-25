import {Atlas} from '../atlas/atlas/Atlas'
import {Image} from '../images/image/Image'
import {ShaderLayout} from '../graphics/shaders/shaderLayout/ShaderLayout'
import {Animator} from '../images/animator/Animator'

const littleEndian: boolean = !!new Int8Array(new Int16Array([1]).buffer)[0]

export namespace InstanceBuffer {
  /** @return The length in bytes. */
  export const size = (layout: ShaderLayout, len: number): number =>
    layout.perInstance.stride * len

  /** @arg size The buffer length in bytes. */
  export const make = (size: number): DataView =>
    new DataView(new ArrayBuffer(size))

  /** Tightly coupled to ShaderLayout and GLSL. */
  export const set = (
    layout: ShaderLayout,
    atlas: Atlas,
    dat: DataView,
    index: number,
    image: Image
  ): void => {
    const i = index * layout.perInstance.stride

    const animation = atlas[image.id]
    const celIndex = Animator.index(image.animator.period, animation.cels)
    const cel = animation.cels[celIndex]
    dat.setInt16(i + 0, cel.position.x, littleEndian)
    dat.setInt16(i + 2, cel.position.y, littleEndian)
    dat.setInt16(i + 4, animation.size.w, littleEndian)
    dat.setInt16(i + 6, animation.size.h, littleEndian)

    const imageAnimation = atlas[image.imageID]
    const imageCelIndex = Animator.index(
      image.animator.period,
      imageAnimation.cels
    )
    const imageCel = imageAnimation.cels[imageCelIndex]
    dat.setInt16(i + 8, imageCel.position.x, littleEndian)
    dat.setInt16(i + 10, imageCel.position.y, littleEndian)
    dat.setInt16(i + 12, imageAnimation.size.w, littleEndian)
    dat.setInt16(i + 14, imageAnimation.size.h, littleEndian)

    dat.setUint8(i + 16, image.alphaComposition)

    dat.setInt16(i + 18, image.bounds.position.x, littleEndian)
    dat.setInt16(i + 20, image.bounds.position.y, littleEndian)
    dat.setInt16(i + 22, image.bounds.size.w, littleEndian)
    dat.setInt16(i + 24, image.bounds.size.h, littleEndian)

    dat.setInt16(i + 26, image.scale.x, littleEndian)
    dat.setInt16(i + 28, image.scale.y, littleEndian)

    dat.setInt16(i + 30, image.wrap.x, littleEndian)
    dat.setInt16(i + 32, image.wrap.y, littleEndian)
    dat.setInt16(i + 34, image.wrapVelocity.x, littleEndian)
    dat.setInt16(i + 36, image.wrapVelocity.y, littleEndian)
  }
}
