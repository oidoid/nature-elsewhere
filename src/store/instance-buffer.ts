import * as Atlas from '../images/atlas'
import * as Image from '../images/image'

const littleEndian: boolean = !!new Int8Array(new Int16Array([1]).buffer)[0]

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
  atlas: Atlas.State,
  dat: DataView,
  index: number,
  img: Image
): void {
  const i = index * layout.perInstance.stride

  dat.setInt16(i + 0, Image.source(img, atlas).x, littleEndian)
  dat.setInt16(i + 2, Image.source(img, atlas).y, littleEndian)
  dat.setInt16(i + 4, atlas[img.id].w, littleEndian)
  dat.setInt16(i + 6, atlas[img.id].h, littleEndian)

  dat.setInt16(i + 8, img.x, littleEndian)
  dat.setInt16(i + 10, img.y, littleEndian)
}
