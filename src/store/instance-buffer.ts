import {Atlas} from '../atlas/atlas'
import {Image} from '../images/image'
import {ShaderLayout} from '../graphics/shaders/shader-layout'

const littleEndian: boolean = !!new Int8Array(new Int16Array([1]).buffer)[0]

export namespace InstanceBuffer {
  /** @return The length in bytes. */
  export function size(layout: ShaderLayout, len: number): number {
    return layout.perInstance.stride * len
  }

  /** @arg size The buffer length in bytes. */
  export function make(size: number): DataView {
    return new DataView(new ArrayBuffer(size))
  }

  /** Tightly coupled to ShaderLayout and GLSL. */
  export function set(
    layout: ShaderLayout,
    atlas: Atlas,
    dat: DataView,
    index: number,
    img: Image
  ): void {
    const i = index * layout.perInstance.stride

    dat.setInt16(i + 0, Image.cel(img, atlas).x, littleEndian)
    dat.setInt16(i + 2, Image.cel(img, atlas).y, littleEndian)
    dat.setInt16(i + 4, atlas[img.id].w, littleEndian)
    dat.setInt16(i + 6, atlas[img.id].h, littleEndian)

    dat.setInt16(i + 8, img.x, littleEndian)
    dat.setInt16(i + 10, img.y, littleEndian)
    dat.setInt16(i + 12, img.w, littleEndian)
    dat.setInt16(i + 14, img.h, littleEndian)

    dat.setInt16(i + 16, img.scale.x, littleEndian)
    dat.setInt16(i + 18, img.scale.y, littleEndian)

    dat.setInt16(i + 20, img.tx, littleEndian)
    dat.setInt16(i + 22, img.ty, littleEndian)
    dat.setInt16(i + 24, img.tvx, littleEndian)
    dat.setInt16(i + 26, img.tvy, littleEndian)
  }
}
