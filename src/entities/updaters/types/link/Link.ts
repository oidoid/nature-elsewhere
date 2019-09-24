import {Update} from '../../Update'
import {LevelUtil} from '../../../../levels/level/LevelUtil'
import {EntityUtil} from '../../../entity/EntityUtil'
import {AtlasID} from '../../../../atlas/atlasID/AtlasID'

export namespace Link {
  export const update: Update = (link, state) => {
    const collision = LevelUtil.collisionWithCursor(state.level, link)
    const color = collision ? AtlasID.PALETTE_GREEN : AtlasID.PALETTE_GREY
    return EntityUtil.setColorID(link, color)
  }
}
