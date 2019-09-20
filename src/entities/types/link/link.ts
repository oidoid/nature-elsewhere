import {Updater} from '../../updaters/updater/updater'
import {UpdateStatus} from '../../updaters/update-status/update-status'
import {Level} from '../../../levels/level/level'

export namespace Link {
  export const update: Updater.Update = (link, state) => {
    const collision = Level.collisionWithCursor(state.level, link)
    if (!collision) return UpdateStatus.UNCHANGED

    console.log(link.id, 'change color here')
    return UpdateStatus.UPDATED
  }
}
