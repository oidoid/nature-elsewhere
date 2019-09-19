import {Atlas} from '../atlas/atlas/atlas'
import {Image} from '../images/image/image'
import {ShaderLayout} from '../graphics/shaders/shader-layout/shader-layout'

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
    img: Image
  ): void => {
    const i = index * layout.perInstance.stride

    dat.setInt16(i + 0, Image.cel(img, atlas).position.x, littleEndian)
    dat.setInt16(i + 2, Image.cel(img, atlas).position.y, littleEndian)
    dat.setInt16(i + 4, atlas[img.id].size.w, littleEndian)
    dat.setInt16(i + 6, atlas[img.id].size.h, littleEndian)

    dat.setInt16(i + 8, img.bounds.x, littleEndian)
    dat.setInt16(i + 10, img.bounds.y, littleEndian)
    dat.setInt16(i + 12, img.bounds.w, littleEndian)
    dat.setInt16(i + 14, img.bounds.h, littleEndian)

    dat.setInt16(i + 16, img.scale.x, littleEndian)
    dat.setInt16(i + 18, img.scale.y, littleEndian)

    dat.setInt16(i + 20, img.wrap.x, littleEndian)
    dat.setInt16(i + 22, img.wrap.y, littleEndian)
    dat.setInt16(i + 24, img.wrapVelocity.x, littleEndian)
    dat.setInt16(i + 26, img.wrapVelocity.y, littleEndian)
  }
}
