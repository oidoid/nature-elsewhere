import {AtlasID} from '../../../../atlas/AtlasID'
import {Level} from '../../../../levels/Level'
import {Entity} from '../../../../entity/Entity'
import {UpdateState} from '../../UpdateState'
import {UpdateStatus} from '../../updateStatus/UpdateStatus'

export namespace LinkUpdater {
  export function update(link: Entity, state: UpdateState): UpdateStatus {
    const collision = Level.collisionWithCursor(state.level, link)
    const color = collision ? AtlasID.PALETTE_BLACK : AtlasID.PALETTE_GREY
    return link.setImageID(color)
  }
}
