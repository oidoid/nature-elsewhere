import {UpdateStatus} from '../../updaters/update-status/update-status'
import {Level} from '../../../levels/level/level'
import {Update} from '../../updaters/update'
import {LevelLink} from './level-link'

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
