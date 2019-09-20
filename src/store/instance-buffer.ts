import {Atlas} from '../atlas/atlas/atlas'
import {Image} from '../images/image/image'
import {ShaderLayout} from '../graphics/shaders/shader-layout/shader-layout'
import {Animator} from '../images/animator/animator'

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

    dat.setInt16(i + 8, image.bounds.x, littleEndian)
    dat.setInt16(i + 10, image.bounds.y, littleEndian)
    dat.setInt16(i + 12, image.bounds.w, littleEndian)
    dat.setInt16(i + 14, image.bounds.h, littleEndian)

    dat.setInt16(i + 16, image.scale.x, littleEndian)
    dat.setInt16(i + 18, image.scale.y, littleEndian)

    dat.setInt16(i + 20, image.wrap.x, littleEndian)
    dat.setInt16(i + 22, image.wrap.y, littleEndian)
    dat.setInt16(i + 24, image.wrapVelocity.x, littleEndian)
    dat.setInt16(i + 26, image.wrapVelocity.y, littleEndian)
  }
}
