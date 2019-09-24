import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Update} from '../../updaters/Update'
import {LevelUtil} from '../../../levels/level/LevelUtil'

export namespace Link {
  export const update: Update = (link, state) => {
    const collision = LevelUtil.collisionWithCursor(state.level, link)
    if (!collision) return UpdateStatus.UNCHANGED

    console.log(link.id, 'change color here')
    return UpdateStatus.UPDATED
  }
}
