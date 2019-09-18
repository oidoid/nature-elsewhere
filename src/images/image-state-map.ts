import {EntityState} from '../entities/entity-state'
import {ImageRect} from './image-rect'

// EntityState | string is terrible
export type ImageStateMap = Readonly<Record<EntityState | string, ImageRect>>
