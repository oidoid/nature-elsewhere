import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {Level} from '../../../levels/level/Level'
import {Update} from '../../updaters/Update'

export namespace Link {
  export const update: Update = (link, state) => {
    const collision = Level.collisionWithCursor(state.level, link)
    if (!collision) return UpdateStatus.UNCHANGED

    console.log(link.id, 'change color here')
    return UpdateStatus.UPDATED
  }
}
