import {Backpacker} from './backpacker'
import {EntityType} from '../../entity-type/entity-type'
import {Entity} from '../../entity/entity'

export namespace BackpackerParser {
  export function parse(player: Entity): Backpacker {
    if (EntityType.assert<Backpacker>(player, EntityType.CHAR_BACKPACKER))
      return player
    throw new Error()
  }
}
