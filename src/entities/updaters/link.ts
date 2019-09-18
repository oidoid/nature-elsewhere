import {Updater} from './updater'
import {UpdateStatus} from './update-status'
import {UpdateState} from './update-state'

export namespace Link {
  export const update: Updater.Update = (link, state) => {
    const collision = UpdateState.collisionWithCursor(state, link)
    if (!collision) return UpdateStatus.UNCHANGED

    console.log(link.id, 'change color here')
    return UpdateStatus.UPDATED
  }
}
