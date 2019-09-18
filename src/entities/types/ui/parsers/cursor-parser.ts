import {Cursor} from '../cursor'
import {Entity} from '../../../entity'
import {EntityType} from '../../entity-type'

export namespace CursorParser {
  export function parse(cursor: Entity): Cursor {
    if (EntityType.assert<Cursor>(cursor, EntityType.UI_CURSOR)) return cursor
    throw new Error()
  }
}
