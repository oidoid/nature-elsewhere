import {Entity} from '../entity/Entity'
import {Input} from '../inputs/Input'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../updaters/UpdateState'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Rect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'

export class Cursor extends Entity<'none', Cursor.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<'none', Cursor.State>) {
    super({
      type: EntityType.UI_CURSOR,
      variant: 'none',
      state: Entity.BaseState.HIDDEN,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Cursor.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.PALETTE_BLACK,
              layer: Layer.UI_CURSOR
            })
          ]
        })
      },
      updatePredicate: UpdatePredicate.ALWAYS,
      // Use bodies so that collision remains the same regardless of whether
      // hidden or not.
      collisionPredicate: CollisionPredicate.BODIES,
      collisionBodies: [Rect.make(0, 0, 1, 1)],
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    let nextState: Entity.BaseState | Cursor.State = Entity.BaseState.HIDDEN
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
}

export namespace Cursor {
  export enum State {
    VISIBLE = 'visible'
  }
}
