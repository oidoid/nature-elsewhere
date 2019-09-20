import {Backpacker} from './backpacker'
import {EntityType} from '../../entity-type/entity-type'
import {Entity} from '../../entity/entity'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'

export namespace BackpackerParser {
  export function parse(player: Entity): Backpacker {
    if (EntityTypeUtil.assert<Backpacker>(player, EntityType.CHAR_BACKPACKER))
      return player
    throw new Error()
  }
}
