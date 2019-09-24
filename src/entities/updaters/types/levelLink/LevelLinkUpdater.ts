import {UpdateStatus} from '../../updateStatus/UpdateStatus'
import {Update} from '../../Update'
import {LevelLink} from './LevelLink'
import {LevelUtil} from '../../../../levels/level/LevelUtil'
import {Input} from '../../../../inputs/Input'

export namespace LevelLinkUpdater {
  export const update: Update = (link, state) => {
    if (!LevelLink.is(link)) throw new Error('Expected LevelLink.')
    const collision = LevelUtil.collisionWithCursor(state.level, link)
    if (!collision) return UpdateStatus.UNCHANGED

    if (!Input.inactiveTriggered(state.inputs.pick))
      return UpdateStatus.UNCHANGED

    LevelUtil.advance(state.level, link.link)
    return UpdateStatus.UPDATED | UpdateStatus.TERMINATE
  }
}
