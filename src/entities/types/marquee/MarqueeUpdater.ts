import {EntityType} from '../../entityType/EntityType'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {Update} from '../../updaters/Update'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Input} from '../../../inputs/Input'
import {Marquee} from './Marquee'
import {XY} from '../../../math/xy/XY'
import {EntityUtil} from '../../entity/EntityUtil'
import {MarqueeState} from './MarqueeState'
import {EntityCollider} from '../../../collision/EntityCollider'
import {EntityID} from '../../entityID/EntityID'
import {EntityState} from '../../entityState/EntityState'

enum Images {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3
}

export namespace MarqueeUpdater {
  export const update: Update = (marquee, state) => {
    if (!EntityTypeUtil.assert<Marquee>(marquee, EntityType.UI_MARQUEE))
      throw new Error()
    let status = UpdateStatus.UNCHANGED

    const sandbox = EntityUtil.findAny(
      state.level.parentEntities,
      EntityID.UI_LEVEL_EDITOR_SANDBOX
    )
    if (!sandbox) return status

    // const collision = LevelUtil.collisionWithCursor(state.level, marquee)

    // const toggle = collision && Input.inactiveTriggered(state.inputs.pick)
    // console.log(toggle)

    const {pick} = state.inputs

    if (!pick || !Input.inactiveTriggered(state.inputs.pick)) return status

    const panel = EntityUtil.findAny(
      state.level.parentEntities,
      EntityID.UI_LEVEL_EDITOR_PANEL
    )
    const panelCollision =
      panel && EntityCollider.collidesEntity(state.level.cursor, panel)

    const cursorSandboxCollision = EntityCollider.collidesEntity(
      state.level.cursor,
      sandbox
    )
    if (!panelCollision && cursorSandboxCollision) {
      const destination = XY.trunc(
        Input.levelXY(pick, state.canvasWH, state.level.cam.bounds)
      )
      status |= EntityUtil.moveTo(marquee, destination)
      status |= EntityUtil.setState(marquee, MarqueeState.VISIBLE)

      const sandboxEntity = cursorSandboxCollision.rhs.descendant // this won't work correctly for sub-entities
      marquee.selected = sandboxEntity.spawnID
      const marqueeImages = EntityUtil.imageRect(marquee).images

      marqueeImages[Images.TOP].bounds.position.x =
        sandboxEntity.bounds.position.x - 1
      marqueeImages[Images.TOP].bounds.position.y =
        sandboxEntity.bounds.position.y - 1
      marqueeImages[Images.TOP].bounds.size.w = sandboxEntity.bounds.size.w + 2
      marqueeImages[Images.TOP].bounds.size.h = 1

      marqueeImages[Images.RIGHT].bounds.position.x =
        sandboxEntity.bounds.position.x + sandboxEntity.bounds.size.w
      marqueeImages[Images.RIGHT].bounds.position.y =
        sandboxEntity.bounds.position.y - 1
      marqueeImages[Images.RIGHT].bounds.size.w = 1
      marqueeImages[Images.RIGHT].bounds.size.h =
        sandboxEntity.bounds.size.h + 2

      marqueeImages[Images.BOTTOM].bounds.position.x =
        sandboxEntity.bounds.position.x - 1
      marqueeImages[Images.BOTTOM].bounds.position.y =
        sandboxEntity.bounds.position.y + sandboxEntity.bounds.size.h
      marqueeImages[Images.BOTTOM].bounds.size.w =
        sandboxEntity.bounds.size.w + 2
      marqueeImages[Images.BOTTOM].bounds.size.h = 1

      marqueeImages[Images.LEFT].bounds.position.x =
        sandboxEntity.bounds.position.x - 1
      marqueeImages[Images.LEFT].bounds.position.y =
        sandboxEntity.bounds.position.y - 1
      marqueeImages[Images.LEFT].bounds.size.w = 1
      marqueeImages[Images.LEFT].bounds.size.h = sandboxEntity.bounds.size.h + 2
    } else if (!panelCollision)
      status |= EntityUtil.setState(marquee, EntityState.HIDDEN)

    return status
  }
}
