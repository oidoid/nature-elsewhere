import {CollisionParty} from '../../../collision/EntityCollider'
import {CollisionType} from '../../../collision/CollisionType'
import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {NumberUtil} from '../../../math/NumberUtil'
import {Update} from '../../updaters/Update'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {XY} from '../../../math/XY'

export interface Backpacker extends Entity {
  readonly type: EntityType.CHAR_BACKPACKER
}

export namespace Backpacker {
  export enum State {
    IDLE_UP = 'idleUp',
    IDLE_RIGHT = 'idleRight',
    IDLE_DOWN = 'idleDown',
    WALK_UP = 'walkUp',
    WALK_RIGHT = 'walkRight',
    WALK_DOWN = 'walkDown'
  }

  export const update: Update = (backpacker, state) => {
    if (!Entity.assert<Backpacker>(backpacker, EntityType.CHAR_BACKPACKER))
      throw new Error()

    const destination = calculateDestination(backpacker, state)
    if (!destination) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED

    const {x, y} = backpacker.bounds.position
    const left = destination.x < x
    const right = destination.x > x
    const up = destination.y < y
    const down = destination.y > y
    backpacker.velocity.x = (left ? -1 : right ? 1 : 0) * 80
    backpacker.velocity.y = (up ? -1 : down ? 1 : 0) * 80

    const idle = !backpacker.velocity.x && !backpacker.velocity.y

    let nextState = backpacker.machine.state
    if (idle) {
      nextState = calculateIdleState(backpacker)
      if (state.level.destination)
        Entity.setState(state.level.destination, Entity.State.HIDDEN)
    } else {
      const horizontalDistance = Math.abs(
        destination.x - backpacker.bounds.position.x
      )
      if (up) nextState = State.WALK_UP
      if (down) nextState = State.WALK_DOWN
      if ((left || right) && ((!up && !down) || horizontalDistance > 5))
        nextState = State.WALK_RIGHT
    }

    const scale = Entity.getScale(backpacker).copy()
    if (up || down || right) scale.x = Math.abs(scale.x)
    if (left) scale.x = -1 * Math.abs(scale.x)

    Entity.setScale(backpacker, scale)
    Entity.setState(backpacker, nextState)

    return status
  }

  export function collides(
    backpacker: Entity,
    collision: CollisionParty,
    state: UpdateState
  ): void {
    if (collision.party.collisionType & CollisionType.OBSTACLE) {
      const idle = calculateIdleState(backpacker)
      Entity.setState(backpacker, idle)
      if (state.level.destination)
        Entity.setState(state.level.destination, Entity.State.HIDDEN)
    }
  }
}

function calculateIdleState(
  backpacker: Entity
): Entity.State | Backpacker.State {
  switch (backpacker.machine.state) {
    case Backpacker.State.WALK_UP:
    case Backpacker.State.IDLE_UP:
      return Backpacker.State.IDLE_UP
    case Backpacker.State.IDLE_RIGHT:
    case Backpacker.State.WALK_RIGHT:
      return Backpacker.State.IDLE_RIGHT
  }
  return Backpacker.State.IDLE_DOWN
}

function calculateDestination(
  backpacker: Backpacker,
  state: UpdateState
): Maybe<XY> {
  if (
    !state.level.destination ||
    state.level.destination.machine.state === Entity.State.HIDDEN
  )
    return
  const {x, y} = state.level.destination.bounds.position.add(
    Entity.imageRect(backpacker).origin
  )
  return new XY(
    NumberUtil.clamp(x, 0, state.level.size.w - backpacker.bounds.size.w),
    NumberUtil.clamp(y, 0, state.level.size.h - backpacker.bounds.size.h)
  )
}
