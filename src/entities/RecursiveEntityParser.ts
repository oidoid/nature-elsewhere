import {Entity} from '../entity/Entity'
import {Atlas} from '../atlas/Atlas'
import {EntityConfig} from '../entity/EntityParser'

export type RecursiveEntityParser = (
  entity: Entity,
  atlas: Atlas,
  parser: IEntityParser
) => Entity

// Workaround for recursive import loop between EntityParser and type parsers.
export type IEntityParser = (config: EntityConfig, atlas: Atlas) => Entity
