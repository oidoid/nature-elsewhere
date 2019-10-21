import {Atlas, Animator} from 'aseprite-atlas'
import {Sprite} from '../sprite/Sprite'
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
    sprite: Readonly<Sprite>
  ): void {
    const i = index * layout.perInstance.stride

    const animation = atlas.animations[sprite.id]
    const celIndex = Animator.index(sprite.animator.period, animation.cels)
    const cel = animation.cels[celIndex]
    dat.setInt16(i + 0, cel.position.x, littleEndian)
    dat.setInt16(i + 2, cel.position.y, littleEndian)
    dat.setInt16(i + 4, animation.size.w, littleEndian)
    dat.setInt16(i + 6, animation.size.h, littleEndian)

    const constituentAnimation = atlas.animations[sprite.constituentID]
    const constituentCelIndex = Animator.index(
      sprite.animator.period,
      constituentAnimation.cels
    )
    const constituentCel = constituentAnimation.cels[constituentCelIndex]
    dat.setInt16(i + 8, constituentCel.position.x, littleEndian)
    dat.setInt16(i + 10, constituentCel.position.y, littleEndian)
    dat.setInt16(i + 12, constituentAnimation.size.w, littleEndian)
    dat.setInt16(i + 14, constituentAnimation.size.h, littleEndian)

    dat.setUint8(i + 16, sprite.composition)

    dat.setInt16(i + 18, sprite.bounds.position.x, littleEndian)
    dat.setInt16(i + 20, sprite.bounds.position.y, littleEndian)
    dat.setInt16(i + 22, sprite.bounds.size.w, littleEndian)
    dat.setInt16(i + 24, sprite.bounds.size.h, littleEndian)

    dat.setInt16(i + 26, sprite.scale.x, littleEndian)
    dat.setInt16(i + 28, sprite.scale.y, littleEndian)

    dat.setInt16(i + 30, sprite.wrap.x, littleEndian)
    dat.setInt16(i + 32, sprite.wrap.y, littleEndian)
    dat.setInt16(i + 34, sprite.wrapVelocity.x, littleEndian)
    dat.setInt16(i + 36, sprite.wrapVelocity.y, littleEndian)
  }
}
