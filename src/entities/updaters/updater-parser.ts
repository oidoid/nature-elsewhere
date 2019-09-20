import {Entity} from '../entity/entity'
import {Atlas} from '../../atlas/atlas/atlas'

export type UpdaterParser = (config: Entity, atlas: Atlas) => Entity
