import {AnimatorSerializer} from './AnimatorSerializer'
import {SpriteConfig} from './SpriteConfig'
import {Sprite} from './Sprite'
import {Layer} from './Layer'

export namespace SpriteSerializer {
  // Serialization is lossy as it almost always produces a width and height.
  // These are usually derived from the atlas but their origin cannot be
  // determined at serialization time without preserving these values explicitly
  // for serialization only.
  //
  // E.g., consider the following SpriteConfig => Sprite => SpriteConfig data:
  //
  //   serialize(Sprite.withAtlasSize(atlas, {id: 'foo'}))
  //     => {id: 'foo', w: 4, h: 5}
  //
  // The sprite will no longer get the atlas default dimensions when it is
  // parsed.
  export function serialize(sprite: Readonly<Sprite>): SpriteConfig {
    const {defaults} = Sprite
    const diff: Writable<SpriteConfig> = {id: sprite.id}
    if (sprite.constituentID !== sprite.id)
      diff.constituentID = sprite.constituentID
    if (sprite.composition !== defaults.composition)
      diff.composition = sprite.composition
    if (sprite.scale.x !== defaults.scale.x) diff.sx = sprite.scale.x
    if (sprite.scale.y !== defaults.scale.y) diff.sy = sprite.scale.y
    if (sprite.bounds.position.x !== defaults.bounds.position.x)
      diff.x = sprite.bounds.position.x
    if (sprite.bounds.position.y !== defaults.bounds.position.y)
      diff.y = sprite.bounds.position.y
    if (sprite.bounds.size.w !== defaults.bounds.size.w)
      diff.w = sprite.bounds.size.w
    if (sprite.bounds.size.h !== defaults.bounds.size.h)
      diff.h = sprite.bounds.size.h
    if (sprite.layer !== defaults.layer) diff.layer = Layer[sprite.layer]
    const animator = AnimatorSerializer.serialize(sprite.animator)
    if (animator?.period !== undefined) diff.period = animator.period
    if (animator?.exposure !== undefined) diff.exposure = animator.exposure
    if (sprite.wrap.x !== defaults.wrap.x) diff.wx = sprite.wrap.x
    if (sprite.wrap.y !== defaults.wrap.y) diff.wy = sprite.wrap.y
    if (sprite.wrapVelocity.x !== defaults.wrapVelocity.x)
      diff.wvx = sprite.wrapVelocity.x
    if (sprite.wrapVelocity.y !== defaults.wrapVelocity.y)
      diff.wvy = sprite.wrapVelocity.y
    return diff
  }
}
