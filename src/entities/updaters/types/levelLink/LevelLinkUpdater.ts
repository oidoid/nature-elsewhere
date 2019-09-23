import {UpdateStatus} from '../../updateStatus/UpdateStatus'
import {Level} from '../../../../levels/level/Level'
import {Update} from '../../Update'
import {LevelLink} from './LevelLink'

export namespace LevelLinkUpdater {
  export const update: Update = (link, state) => {
    if (!LevelLink.is(link)) throw new Error('Expected LevelLink.')
    const collision = Level.collisionWithCursor(state.level, link)
    if (!collision) return UpdateStatus.UNCHANGED

    const {pick} = state.inputs
    if (!pick || !pick.active) return UpdateStatus.UNCHANGED

    Level.advance(state.level, link.link)
    return UpdateStatus.UPDATED | UpdateStatus.TERMINATE
  }
}
