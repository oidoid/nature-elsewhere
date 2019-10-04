import {Entity} from '../../../entity/Entity'
import {Input} from '../../../inputs/Input'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../../updaters/UpdateState'
import {EntityType} from '../../../entity/EntityType'
import {ImageRect} from '../../../imageStateMachine/ImageRect'
import {ImageStateMachine} from '../../../imageStateMachine/ImageStateMachine'
import {CollisionPredicate} from '../../../collision/CollisionPredicate'
import {Rect} from '../../../math/Rect'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'
import {Image} from '../../../image/Image'
import {AtlasID} from '../../../atlas/AtlasID'
import {Layer} from '../../../image/Layer'

export class Cursor extends Entity {
  constructor(
    {
      type = EntityType.UI_CURSOR,
      machine = new ImageStateMachine({
        state: Entity.State.HIDDEN,
        map: {
          [Entity.State.HIDDEN]: new ImageRect(),
          [CursorState.VISIBLE]: new ImageRect({
            images: [
              new Image({id: AtlasID.PALETTE_BLACK, layer: Layer.UI_CURSOR})
            ]
          })
        }
      }),
      updatePredicate = UpdatePredicate.ALWAYS,
      // Use bodies so that collision remains the same regardless of whether
      // hidden or not.
      collisionPredicate = CollisionPredicate.BODIES,
      collisionBodies = [Rect.make(0, 0, 1, 1)],
      ...props
    }: Entity.Props = {type: EntityType.UI_CURSOR}
  ) {
    super({
      ...props,
      type,
      machine,
      updatePredicate,
      collisionPredicate,
      collisionBodies
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
