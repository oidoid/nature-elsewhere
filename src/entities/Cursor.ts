import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Input} from '../inputs/Input'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

export class Cursor extends Entity<Cursor.Variant, Cursor.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Cursor.Variant, Cursor.State>
  ) {
    super({
      ...defaults,
      collisionBodies:
        (props?.variant ?? defaults.variant) === Cursor.Variant.DOT
          ? [Rect.make(-1, -1, 3, 3)]
          : (props?.variant ?? defaults.variant) === Cursor.Variant.RETICLE
          ? [Rect.make(0, 0, 9, 7)]
          : [Rect.make(-1, 0, 3, 3)],
      map: {
        [Cursor.State.HIDDEN]: new SpriteRect(),
        [Cursor.State.VISIBLE]: variantRect(atlas, props)
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    let nextState = this.state
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      // it would be good to throttle this so precise picking is easier
      nextState = Cursor.State.VISIBLE
      const position = Input.levelXY(
        pick,
        state.canvasSize,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    } else if (point && point.active) {
      nextState = Cursor.State.VISIBLE
      const position = Input.levelXY(
        point,
        state.canvasSize,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    }
    status |= this.transition(nextState)

    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Cursor {
  export enum Variant {
    DOT = 'dot',
    RETICLE = 'reticle',
    HAND = 'hand'
  }

  export enum State {
    HIDDEN = 'hidden',
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_CURSOR,
  variant: Cursor.Variant.DOT,
  state: Cursor.State.HIDDEN,
  updatePredicate: UpdatePredicate.ALWAYS,
  // Use bodies so that collision remains the same regardless of whether hidden
  // or not.
  collisionPredicate: CollisionPredicate.BODIES
})

function variantRect(
  atlas: Atlas,
  props?: Entity.SubProps<Cursor.Variant, Cursor.State>
): SpriteRect {
  const variant = props?.variant ?? defaults.variant
  switch (variant) {
    case Cursor.Variant.DOT:
      return new SpriteRect({
        origin: new XY(1, 1),
        sprites: [
          Sprite.withAtlasSize(atlas, {
            id: AtlasID.PALETTE_BLACK,
            layer: Layer.UI_CURSOR
          })
        ]
      })
    case Cursor.Variant.RETICLE:
      return new SpriteRect({
        origin: new XY(4, 3),
        sprites: [
          Sprite.withAtlasSize(atlas, {
            id: AtlasID.UI_CURSOR_RETICLE,
            layer: Layer.UI_CURSOR
          })
        ]
      })
    case Cursor.Variant.HAND:
      return new SpriteRect({
        origin: new XY(3, 0),
        sprites: [
          Sprite.withAtlasSize(atlas, {
            id: AtlasID.UI_CURSOR_HAND,
            layer: Layer.UI_CURSOR
          })
        ]
      })
  }
}
