import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Input} from '../inputs/Input'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Rect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../math/XY'

export class Cursor extends Entity<Cursor.Variant, Cursor.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Cursor.Variant, Cursor.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Cursor.State.VISIBLE]: variantRect(atlas, props)
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    let nextState: Entity.BaseState | Cursor.State = this.state()
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      // it would be good to throttle this so precise picking is easier
      nextState = Cursor.State.VISIBLE
      const position = Input.levelXY(
        pick,
        state.canvasSize,
        state.level.cam.bounds
      )
      status |= this.moveTo(position.sub(this.origin()))
    } else if (point && point.active) {
      nextState = Cursor.State.VISIBLE
      const position = Input.levelXY(
        point,
        state.canvasSize,
        state.level.cam.bounds
      )
      status |= this.moveTo(position.sub(this.origin()))
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
    RETICLE = 'reticle'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_CURSOR,
  variant: Cursor.Variant.DOT,
  state: Entity.BaseState.HIDDEN,
  updatePredicate: UpdatePredicate.ALWAYS,
  // Use bodies so that collision remains the same regardless of whether
  // hidden or not.
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: [Rect.make(0, 0, 1, 1)]
})

function variantRect(
  atlas: Atlas,
  props?: Entity.SubProps<Cursor.Variant, Cursor.State>
): ImageRect {
  const dot =
    ((props && props.variant) || defaults.variant) === Cursor.Variant.DOT
  return new ImageRect({
    origin: dot ? undefined : new XY(4, 3),
    images: [
      new Image(atlas, {
        id: dot ? AtlasID.PALETTE_BLACK : AtlasID.UI_CURSOR_RETICLE,
        layer: Layer.UI_CURSOR
      })
    ]
  })
}
