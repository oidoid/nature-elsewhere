import {Entity} from '../entity/Entity'
import {NumberUtil} from '../math/NumberUtil'
import {UpdateState} from './UpdateState'
import {UpdateStatus} from './updateStatus/UpdateStatus'
import {XY} from '../math/XY'

export namespace WraparoundUpdater {
  export function update(entity: Entity, state: UpdateState): UpdateStatus {
    const {position, size} = entity.bounds
    const destination = new XY(
      NumberUtil.wrap(position.x, -size.w + 1, state.level.size.w - 1),
      NumberUtil.wrap(position.y, -size.h + 1, state.level.size.h - 1)
    )
    return entity.moveTo(destination)
  }
}
