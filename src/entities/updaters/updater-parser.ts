import {Entity} from '../entity/entity'
import {Atlas} from '../../atlas/atlas/atlas'
import {RecursiveEntityParser} from '../entity-type-parser'

export type UpdaterParser = (
  config: Entity,
  atlas: Atlas,
  parser: RecursiveEntityParser
) => Entity
