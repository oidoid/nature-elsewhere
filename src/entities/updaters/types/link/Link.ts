import {Update} from '../../Update'

import {AtlasID} from '../../../../atlas/AtlasID'
import {Entity} from '../../../../entity/Entity'
import {Level} from '../../../../levels/Level'

export namespace Link {
  export const update: Update = (link, state) => {
    const collision = Level.collisionWithCursor(state.level, link)
    const color = collision ? AtlasID.PALETTE_BLACK : AtlasID.PALETTE_GREY
    return Entity.setImageID(link, color)
  }
}
