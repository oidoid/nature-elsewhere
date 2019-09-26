import {Entity} from '../../entity/Entity'
import {Atlas} from '../../atlas/Atlas'
import {IEntityParser} from '../RecursiveEntityParser'

export type UpdaterParser = (
  config: Entity,
  atlas: Atlas,
  parser: IEntityParser
) => Entity
