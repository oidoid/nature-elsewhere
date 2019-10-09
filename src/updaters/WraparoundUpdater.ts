import {Entity} from '../entity/Entity'
import {NumberUtil} from '../math/NumberUtil'
import {UpdateState} from './UpdateState'
import {UpdateStatus} from './updateStatus/UpdateStatus'
import {XY} from '../math/XY'

export namespace WraparoundUpdater {
  export function update(entity: Entity, state: UpdateState): UpdateStatus {
    const {bounds} = entity
    const destination = new XY(
      NumberUtil.wrap(
        bounds.position.x,
        -bounds.size.w + 1, // 8 works but not 1
        state.level.size.w - 1
      ),
      NumberUtil.wrap(
        bounds.position.y,
        -bounds.size.h + 1,
        state.level.size.h - 1
      )
    )
    return entity.moveTo(destination)
  }
}
