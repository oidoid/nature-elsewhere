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
  data: DataView,
  index: number,
  image: Image
): void {
  const i = index * layout.perInstance.stride

  data.setInt16(i + 0, Image.source(image, atlas).x, littleEndian)
  data.setInt16(i + 2, Image.source(image, atlas).y, littleEndian)
  data.setInt16(i + 4, atlas[image.id].w, littleEndian)
  data.setInt16(i + 6, atlas[image.id].h, littleEndian)

  data.setInt16(i + 8, image.x, littleEndian)
  data.setInt16(i + 10, image.y, littleEndian)
}
