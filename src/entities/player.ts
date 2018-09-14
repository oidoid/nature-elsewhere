import {Action, ActionState} from '../input/action'
import {Sprite} from '../assets/sprites/sprite'
import {TextureAtlas} from '../assets/textures/texture-atlas'
import {TEXTURE, Texture} from '../assets/textures/texture'

function grounded(sprite: Sprite): boolean {
  return sprite.position.y >= 70
}

function texture(sprite: Sprite, actionState: ActionState): Texture {
  if (actionState[Action.DOWN]) {
    if (!grounded(sprite)) return TEXTURE.PLAYER_DESCEND
    if (
      sprite.texture === TEXTURE.PLAYER_CROUCH ||
      sprite.texture === TEXTURE.PLAYER_SIT
    ) {
      return TEXTURE.PLAYER_SIT
    }

    return TEXTURE.PLAYER_CROUCH
  }
  if (actionState[Action.UP] || !grounded(sprite)) return TEXTURE.PLAYER_ASCEND

  if (actionState[Action.LEFT] || actionState[Action.RIGHT]) {
    if (actionState[Action.RUN]) return TEXTURE.PLAYER_RUN
    return TEXTURE.PLAYER_WALK
  }

  return TEXTURE.PLAYER_IDLE
}

function scale(sprite: Sprite, actionState: ActionState): void {
  sprite.scale.x = actionState[Action.LEFT]
    ? -1
    : actionState[Action.RIGHT]
      ? 1
      : sprite.scale.x
}

function position(
  sprite: Sprite,
  actionState: ActionState,
  step: number
): void {
  if (grounded(sprite) && actionState[Action.DOWN]) return
  // todo: add pixel per second doc.
  const pps = (actionState[Action.RUN] ? 48 : 16) * step
  sprite.position.x = Math.max(
    0,
    sprite.position.x -
      (actionState[Action.LEFT] ? pps : 0) +
      (actionState[Action.RIGHT] ? pps : 0)
  )
  sprite.position.y = Math.min(
    70,
    sprite.position.y -
      (actionState[Action.UP] ? pps : 0) +
      (actionState[Action.DOWN] ? pps : 0)
  )
}

// if undefined, identity

// const player = {
//   scale: {
//     x: {[Action.LEFT]: -1, [Action.RIGHT]: 1}
//   },
//   texture: {
//     [Action.UP]: TEXTURE.PLAYER_ASCEND,
//     [Action.DOWN]:

//     ? sprite.position.y < 70
//         ? TEXTURE.PLAYER_DESCEND
//         : TEXTURE.PLAYER_CROUCH
//       : actionState[Action.LEFT] || actionState[Action.RIGHT]
//         ? actionState[Action.RUN]
//           ? TEXTURE.PLAYER_RUN
//           : TEXTURE.PLAYER_WALK
//         : TEXTURE.PLAYER_IDLE

//   }
// }

export function update(
  atlas: TextureAtlas,
  actionState: ActionState,
  sprite: Sprite,
  step: number
): void {
  scale(sprite, actionState)
  position(sprite, actionState, step)

  sprite.texture = texture(sprite, actionState)
  sprite.celIndex =
    Math.abs(
      Math.round(sprite.position.x / (actionState[Action.RUN] ? 6 : 2))
    ) % atlas.animations[sprite.texture.textureID].cels.length
}
