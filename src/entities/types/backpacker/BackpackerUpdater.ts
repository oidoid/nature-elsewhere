import {XY} from '../../../math/XY'
import {EntityType} from '../../../entity/EntityType'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {NumberUtil} from '../../../math/NumberUtil'
import {Update} from '../../updaters/Update'
import {Backpacker} from './Backpacker'
import {Entity} from '../../../entity/Entity'
import {UpdateState} from '../../updaters/UpdateState'

export namespace BackpackerUpdater {
  export const update: Update = (backpacker, state) => {
    if (!Entity.assert<Backpacker>(backpacker, EntityType.CHAR_BACKPACKER))
      throw new Error()

    const destination = calculateDestination(backpacker, state)
    if (!destination) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED

    const {x, y} = backpacker.bounds.position
    const left = destination.x < Math.trunc(x)
    const right = destination.x > Math.trunc(x)
    const up = destination.y < Math.trunc(y)
    const down = destination.y > Math.trunc(y)
    backpacker.velocity.x = (left ? -1 : right ? 1 : 0) * 80
    backpacker.velocity.y = (up ? -1 : down ? 1 : 0) * 80

    const idle = !backpacker.velocity.x && !backpacker.velocity.y

    let nextState = backpacker.machine.state
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
        Entity.setState(state.level.destination, Entity.State.HIDDEN)
    } else {
      if (up) nextState = Backpacker.State.WALK_UP
      if (down) nextState = Backpacker.State.WALK_DOWN
      if (left || right) nextState = Backpacker.State.WALK_RIGHT
    }

    const scale = Entity.getScale(backpacker).copy()
    if (up || down) scale.x = Math.abs(scale.x)
    if (left) scale.x = -1 * Math.abs(scale.x)
    if (right) scale.x = Math.abs(scale.x)

    Entity.setScale(backpacker, scale)
    Entity.setState(backpacker, nextState)

    return status
  }
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
