import {XY} from '../../../math/xy/XY'
import {EntityType} from '../../entityType/EntityType'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {EntityState} from '../../entityState/EntityState'
import {EntityCollider} from '../../../collision/EntityCollider'
import {NumberUtil} from '../../../math/number/NumberUtil'
import {Update} from '../../updaters/Update'
import {Backpacker} from './Backpacker'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'

import {BackpackerState} from './BackpackerState'

import {Entity} from '../../entity/Entity'
import {Level} from '../../../levels/level/Level'

export namespace BackpackerUpdater {
  export const update: Update = (backpacker, state) => {
    if (
      !EntityTypeUtil.assert<Backpacker>(backpacker, EntityType.CHAR_BACKPACKER)
    )
      throw new Error()
    if (
      !state.level.destination ||
      state.level.destination.machine.state === EntityState.HIDDEN
    )
      return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED

    let {x, y} = backpacker.bounds.position
    const {x: originalX, y: originalY} = backpacker.bounds.position

    let dst = XY.trunc(state.level.destination.bounds.position)
    dst = XY.add(dst, Entity.imageRect(backpacker).origin)
    dst = {
      x: NumberUtil.clamp(
        dst.x,
        0,
        state.level.size.w - backpacker.bounds.size.w
      ),
      y: NumberUtil.clamp(
        dst.y,
        0,
        state.level.size.h - backpacker.bounds.size.h
      )
    }

    const left = dst.x < Math.trunc(x)
    const right = dst.x > Math.trunc(x)
    const up = dst.y < Math.trunc(y)
    const down = dst.y > Math.trunc(y)
    const speed = Entity.velocity(
      backpacker,
      state.time,
      left || right,
      up || down
    )

    if (up) y -= speed.y
    if (down) y += speed.y
    if (left) x -= speed.x
    if (right) x += speed.x

    Entity.moveTo(backpacker, {x, y})

    const diagonal = (left || right) && (up || down)
    const collision = EntityCollider.collidesEntities(
      backpacker,
      Level.activeParents(state.level)
    )

    const collisionDirection = {x: !!collision, y: !!collision}
    if (diagonal && collision) {
      Entity.moveTo(backpacker, {x, y: originalY})
      collisionDirection.x = !!EntityCollider.collidesEntities(
        backpacker,
        Level.activeParents(state.level)
      )
      if (!collisionDirection.x) y = originalY

      if (collisionDirection.x) {
        Entity.moveTo(backpacker, {x: originalX, y})
        collisionDirection.y = !!EntityCollider.collidesEntities(
          backpacker,
          Level.activeParents(state.level)
        )
        if (!collisionDirection.y) x = originalX
      }
    }
    if (collisionDirection.x) x = originalX
    if (collisionDirection.y) y = originalY

    if (diagonal && !collisionDirection.x && !collisionDirection.y) {
      // Synchronize x and y pixel diagonal movement.
      if ((left && up) || (right && down)) y = Math.trunc(y) + (x % 1)
      // One direction is negative, the other is positive. Offset by 1 - speed
      // to synchronize.
      if ((left && down) || (right && up)) y = Math.trunc(y) + (1 - (x % 1))
    }
    Entity.moveTo(backpacker, {x, y})

    const idle =
      XY.equal(XY.trunc({x, y}), dst) ||
      (collisionDirection.x && collisionDirection.y)

    const animateHorizontal = Math.abs(x - dst.x) > 8
    let nextState = backpacker.machine.state
    if (idle) {
      nextState =
        nextState === BackpackerState.WALK_UP ||
        nextState === BackpackerState.IDLE_UP
          ? BackpackerState.IDLE_UP
          : nextState === BackpackerState.IDLE_RIGHT ||
            nextState === BackpackerState.WALK_RIGHT
          ? BackpackerState.IDLE_RIGHT
          : BackpackerState.IDLE_DOWN
      if (state.level.destination)
        Entity.setState(state.level.destination, EntityState.HIDDEN)
    } else {
      if (up) nextState = BackpackerState.WALK_UP
      if (down) nextState = BackpackerState.WALK_DOWN
      if ((left || right) && (!diagonal || animateHorizontal))
        nextState = BackpackerState.WALK_RIGHT
    }

    const scale = {...Entity.getScale(backpacker)}
    if (up || down) scale.x = Math.abs(scale.x)
    if (left && (!diagonal || animateHorizontal))
      scale.x = -1 * Math.abs(scale.x)
    if (right && (!diagonal || animateHorizontal)) scale.x = Math.abs(scale.x)

    Entity.setScale(backpacker, scale)
    Entity.setState(backpacker, nextState)

    return status
  }
}
