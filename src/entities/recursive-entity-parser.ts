import {Entity} from './entity/entity'
import {Atlas} from '../atlas/atlas/atlas'
import {EntityConfig} from './entity/entity-config'

export type RecursiveEntityParser = (
  entity: Entity,
  atlas: Atlas,
  parser: IEntityParser
) => Entity

// Workaround for recursive import loop between EntityParser and type parsers.
export type IEntityParser = (config: EntityConfig, atlas: Atlas) => Entity
