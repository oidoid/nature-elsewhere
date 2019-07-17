import * as Image from '../images/image'
import {Atlas} from '../images/atlas'

export namespace StoreBuffer {
  const littleEndian: boolean =
    new Int8Array(new Int16Array([1]).buffer)[0] === 1

  /** @return The length in bytes. */
  export function size(layout: ShaderLayout, length: number): number {
    return layout.perInstance.stride * length
  }

  /** @arg size The buffer length in bytes. */
  export function make(size: number): DataView {
    return new DataView(new ArrayBuffer(size))
  }

  /** Tightly coupled to ShaderLayout and GLSL. */
  export function set(
    layout: ShaderLayout,
    atlas: Atlas.Definition,
    data: DataView,
    index: number,
    image: Image
  ): void {
    const i = index * layout.perInstance.stride

    data.setInt16(i + 0, Image.source(image, atlas).position.x, littleEndian)
    data.setInt16(i + 2, Image.source(image, atlas).position.y, littleEndian)
    data.setInt16(i + 4, atlas.animations[image.id].size.w, littleEndian)
    data.setInt16(i + 6, atlas.animations[image.id].size.h, littleEndian)

    data.setInt16(i + 8, image.x, littleEndian)
    data.setInt16(i + 10, image.y, littleEndian)
  }
}
