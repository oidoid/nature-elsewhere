import {Entity} from '../entity/Entity'
import {Input} from '../inputs/Input'
import {UpdateStatus} from '../entities/updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../entities/updaters/UpdateState'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {Rect} from '../math/Rect'
import {UpdatePredicate} from '../entities/updaters/updatePredicate/UpdatePredicate'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Layer} from '../image/Layer'
import {Atlas} from 'aseprite-atlas'

export class Cursor extends Entity {
  constructor(atlas: Atlas, props?: Entity.Props) {
    super({
      type: EntityType.UI_CURSOR,
      state: Entity.State.HIDDEN,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [CursorState.VISIBLE]: new ImageRect({
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
    let nextState: CursorState | Entity.State = Entity.State.HIDDEN
    const {point, pick} = state.inputs
    if (pick && pick.active) {
      // it would be good to throttle this so precise picking is easier
      nextState = CursorState.VISIBLE
      const position = Input.levelXY(
        pick,
        state.canvasWH,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    } else if (point && point.active) {
      nextState = CursorState.VISIBLE
      const position = Input.levelXY(
        point,
        state.canvasWH,
        state.level.cam.bounds
      )
      status |= this.moveTo(position)
    }
    status |= this.setState(nextState)

    return status
  }
}
export enum CursorState {
  VISIBLE = 'visible'
}
