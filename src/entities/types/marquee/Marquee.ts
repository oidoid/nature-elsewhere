import {EntityCollider} from '../../../collision/EntityCollider'
import {Entity} from '../../../entity/Entity'
import {EntityID} from '../../../entity/EntityID'
import {Input} from '../../../inputs/Input'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {XY} from '../../../math/XY'
import {UpdateState} from '../../updaters/UpdateState'
import {WH} from '../../../math/WH'

export class Marquee extends Entity {
  selection?: Symbol
  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)

    const sandbox = Entity.findAnyByID(
      state.level.parentEntities,
      EntityID.UI_LEVEL_EDITOR_SANDBOX
    )
    if (!sandbox) return status

    // const collision = Level.collisionWithCursor(state.level, marquee)

    // const toggle = collision && Input.inactiveTriggered(state.inputs.pick)
    // console.log(toggle)

    const {pick} = state.inputs

    if (!pick || !Input.inactiveTriggered(state.inputs.pick)) return status

    const panel = Entity.findAnyByID(
      state.level.parentEntities,
      EntityID.UI_LEVEL_EDITOR_PANEL
    )
    const panelCollision = panel
      ? EntityCollider.collidesEntity(state.level.cursor, panel)
      : []

    const cursorSandboxCollision = EntityCollider.collidesEntity(
      state.level.cursor,
      sandbox
    )
    if (!panelCollision.length && cursorSandboxCollision.length) {
      status |= this.setState(MarqueeState.VISIBLE)

      const sandboxEntity = cursorSandboxCollision[0] // this won't work correctly for sub-entities
      this.selection = sandboxEntity.spawnID

      const destination = new XY(
        sandboxEntity.bounds.position.x - 1,
        sandboxEntity.bounds.position.y - 1
      )
      status |= this.moveTo(destination)
      doTheStuffAndThings(this, destination, sandboxEntity)
    } else if (!panelCollision.length) {
      status |= this.setState(Entity.State.HIDDEN)
      this.selection = undefined
    }

    return status
  }
}

export enum MarqueeState {
  VISIBLE = 'visible'
}

enum Images {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3
}

export namespace MarqueeUpdater {}

function doTheStuffAndThings(
  marquee: Marquee,
  destination: XY,
  sandboxEntity: Entity
): void {
  const rect = marquee.imageRect()
  const marqueeImages = rect.images

  rect.bounds.position.x = destination.x
  rect.bounds.position.y = destination.y
  rect.bounds.size.w = sandboxEntity.bounds.size.w + 2
  rect.bounds.size.h = sandboxEntity.bounds.size.h + 2

  marqueeImages[Images.TOP].moveTo(destination)
  marqueeImages[Images.TOP].sizeTo(new WH(sandboxEntity.bounds.size.w + 2, 1))

  marqueeImages[Images.LEFT].moveTo(destination)
  marqueeImages[Images.LEFT].sizeTo(new WH(1, sandboxEntity.bounds.size.h + 2))

  marqueeImages[Images.RIGHT].moveTo(
    new XY(destination.x + sandboxEntity.bounds.size.w + 1, destination.y)
  )
  marqueeImages[Images.RIGHT].sizeTo(new WH(1, sandboxEntity.bounds.size.h + 2))
  marqueeImages[Images.RIGHT].wrapTo(
    new XY((sandboxEntity.bounds.size.w + 1) & 1 ? 1 : 0, 0)
  )

  marqueeImages[Images.BOTTOM].moveTo(
    new XY(destination.x, destination.y + sandboxEntity.bounds.size.h + 1)
  )
  marqueeImages[Images.BOTTOM].sizeTo(
    new WH(sandboxEntity.bounds.size.w + 2, 1)
  )
  marqueeImages[Images.BOTTOM].wrapTo(
    new XY((sandboxEntity.bounds.size.h + 1) & 1 ? 1 : 0, 0)
  )
}
