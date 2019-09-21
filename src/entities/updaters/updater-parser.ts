import {Entity} from '../entity/entity'
import {Atlas} from '../../atlas/atlas/atlas'
import {IEntityParser} from '../recursive-entity-parser'

export type UpdaterParser = (
  config: Entity,
  atlas: Atlas,
  parser: IEntityParser
) => Entity
