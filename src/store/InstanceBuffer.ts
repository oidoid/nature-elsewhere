import {Atlas, Animator} from 'aseprite-atlas'
import {Image} from '../image/Image'
import {ShaderLayout} from '../renderer/ShaderLayout'

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
    image: Readonly<Image>
  ): void {
    const i = index * layout.perInstance.stride

    const animation = atlas.animations[image.id]
    const celIndex = Animator.index(image.animator.period, animation.cels)
    const cel = animation.cels[celIndex]
    dat.setInt16(i + 0, cel.position.x, littleEndian)
    dat.setInt16(i + 2, cel.position.y, littleEndian)
    dat.setInt16(i + 4, animation.size.w, littleEndian)
    dat.setInt16(i + 6, animation.size.h, littleEndian)

    const constituentAnimation = atlas.animations[image.constituentID]
    const constituentCelIndex = Animator.index(
      image.animator.period,
      constituentAnimation.cels
    )
    const constituentCel = constituentAnimation.cels[constituentCelIndex]
    dat.setInt16(i + 8, constituentCel.position.x, littleEndian)
    dat.setInt16(i + 10, constituentCel.position.y, littleEndian)
    dat.setInt16(i + 12, constituentAnimation.size.w, littleEndian)
    dat.setInt16(i + 14, constituentAnimation.size.h, littleEndian)

    dat.setUint8(i + 16, image.composition)

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
