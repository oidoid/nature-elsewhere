import {Updater} from '../../updaters/updater/updater'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {UpdateState} from '../../updaters/update-state'

export namespace Link {
  export const update: Updater.Update = (link, state) => {
    const collision = UpdateState.collisionWithCursor(state, link)
    if (!collision) return UpdateStatus.UNCHANGED

    console.log(link.id, 'change color here')
    return UpdateStatus.UPDATED
  }
}
