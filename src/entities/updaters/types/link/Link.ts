import {Update} from '../../Update'

import {AtlasID} from '../../../../atlas/atlasID/AtlasID'
import {Entity} from '../../../entity/Entity'
import {Level} from '../../../../levels/level/Level'

export namespace Link {
  export const update: Update = (link, state) => {
    const collision = Level.collisionWithCursor(state.level, link)
    const color = collision ? AtlasID.PALETTE_BLACK : AtlasID.PALETTE_GREY
    return Entity.setImageID(link, color)
  }
}
