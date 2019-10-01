import {Entity} from '../../entity/Entity'
import {Atlas} from 'aseprite-atlas'
import {IEntityParser} from '../RecursiveEntityParser'

export type UpdaterParser = (
  config: Entity,
  atlas: Atlas,
  parser: IEntityParser
) => Entity
