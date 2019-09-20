import {Entity} from './entity/entity'
import {Atlas} from '../atlas/atlas/atlas'
import {EntityConfig} from './entity/entity-config'

export type EntityTypeParse = (
  entity: Entity,
  atlas: Atlas,
  parser: RecursiveEntityParser
) => Entity

// Workaround for recursive import loop between EntityParser and type parsers.
export type RecursiveEntityParser = (
  config: EntityConfig,
  atlas: Atlas
) => Entity
