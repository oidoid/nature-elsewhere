import {Entity} from '../entity'
import {EntityArrayConfig} from './entity-array-config'
import {EntityParser} from './entity-parser'
import {Atlas} from '../../atlas/atlas'

export namespace EntityArrayParser {
  export function parse(config: EntityArrayConfig, atlas: Atlas): Entity[] {
    return (config || []).map(entityConfig =>
      EntityParser.parse(entityConfig, atlas)
    )
  }
}
