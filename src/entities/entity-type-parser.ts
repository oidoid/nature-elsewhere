import {Entity} from './entity/entity'
import {Atlas} from '../atlas/atlas/atlas'

export type EntityTypeParse = (entity: Entity, atlas: Atlas) => Entity
