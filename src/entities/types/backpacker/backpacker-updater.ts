import {XY} from '../../../math/xy/xy'
import {EntityType} from '../../entity-type/entity-type'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {EntityState} from '../../entity-state/entity-state'
import {EntityCollider} from '../../../collision/entity-collider'
import {NumberUtil} from '../../../math/number/number-util'
import {Level} from '../../../levels/level/level'
import {Update} from '../../updaters/update'
import {Backpacker} from './backpacker'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'

export namespace BackpackerUpdater {
  export const update: Update = (backpacker, state) => {
    if (
      !EntityTypeUtil.assert<Backpacker>(backpacker, EntityType.CHAR_BACKPACKER)
    )
      throw new Error()
    if (!state.level.destination) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED

    let {x, y} = backpacker.bounds
    const {x: originalX, y: originalY} = backpacker.bounds

    let dst = XY.trunc(state.level.destination.bounds)
    dst = XY.add(dst, EntityUtil.imageState(backpacker).origin)
    dst = {
      x: NumberUtil.clamp(dst.x, 0, state.level.size.w - backpacker.bounds.w),
      y: NumberUtil.clamp(dst.y, 0, state.level.size.h - backpacker.bounds.h)
    }

    const left = dst.x < Math.trunc(x)
    const right = dst.x > Math.trunc(x)
    const up = dst.y < Math.trunc(y)
    const down = dst.y > Math.trunc(y)
    const speed = EntityUtil.velocity(
      backpacker,
      state.time,
      left || right,
      up || down
    )

    if (up) y -= speed.y
    if (down) y += speed.y
    if (left) x -= speed.x
    if (right) x += speed.x

    EntityUtil.moveTo(backpacker, {x, y})

    const diagonal = (left || right) && (up || down)
    const collision = EntityCollider.collidesEntities(
      backpacker,
      Level.activeParents(state.level)
    )

    const collisionDirection = {x: !!collision, y: !!collision}
    if (diagonal && collision) {
      EntityUtil.moveTo(backpacker, {x, y: originalY})
      collisionDirection.x = !!EntityCollider.collidesEntities(
        backpacker,
        Level.activeParents(state.level)
      )
      if (!collisionDirection.x) y = originalY

      if (collisionDirection.x) {
        EntityUtil.moveTo(backpacker, {x: originalX, y})
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
    EntityUtil.moveTo(backpacker, {x, y})

    const idle =
      XY.equal(XY.trunc({x, y}), dst) ||
      (collisionDirection.x && collisionDirection.y)

    const animateHorizontal = Math.abs(x - dst.x) > 8
    let nextState = backpacker.state
    if (idle) {
      nextState =
        nextState === Backpacker.State.WALK_UP ||
        nextState === Backpacker.State.IDLE_UP
          ? Backpacker.State.IDLE_UP
          : nextState === Backpacker.State.IDLE_RIGHT ||
            nextState === Backpacker.State.WALK_RIGHT
          ? Backpacker.State.IDLE_RIGHT
          : Backpacker.State.IDLE_DOWN
      if (state.level.destination)
        EntityUtil.setState(state.level.destination, EntityState.HIDDEN)
    } else {
      if (up) nextState = Backpacker.State.WALK_UP
      if (down) nextState = Backpacker.State.WALK_DOWN
      if ((left || right) && (!diagonal || animateHorizontal))
        nextState = Backpacker.State.WALK_RIGHT
    }

    let flipX = backpacker.scale.x
    if (up || down) flipX = 1
    if (left && (!diagonal || animateHorizontal)) flipX = -1
    if (right && (!diagonal || animateHorizontal)) flipX = 1

    EntityUtil.setScale(backpacker, {x: flipX, y: backpacker.scale.y})
    EntityUtil.setState(backpacker, nextState)

    return status
  }
}
