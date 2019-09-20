import {Cursor} from './cursor'
import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'

export namespace CursorParser {
  export function parse(cursor: Entity): Cursor {
    if (EntityTypeUtil.assert<Cursor>(cursor, EntityType.UI_CURSOR))
      return cursor
    throw new Error()
  }
}
