import {Entity} from '../entity/entity'
import {EntityArrayConfig} from './entity-array-config'
import {Atlas} from '../../atlas/atlas/atlas'
import {EntityParser} from '../entity/entity-parser'

export namespace EntityArrayParser {
  export function parse(config: EntityArrayConfig, atlas: Atlas): Entity[] {
    return (config || []).map(entityConfig =>
      EntityParser.parse(entityConfig, atlas)
    )
  }
}
