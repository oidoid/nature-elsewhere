import {Update} from '../../Update'

import {AtlasID} from '../../../../atlas/AtlasID'
import {Level} from '../../../../levels/Level'

export namespace Link {
  export const update: Update = (link, state) => {
    const collision = Level.collisionWithCursor(state.level, link)
    const color = collision ? AtlasID.PALETTE_BLACK : AtlasID.PALETTE_GREY
    return link.setImageID(color)
  }
}
