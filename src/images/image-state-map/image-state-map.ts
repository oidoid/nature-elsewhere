import {EntityState} from '../../entities/entity-state/entity-state'
import {ImageRect} from '../image-rect/image-rect'

export interface ImageStateMap
  extends Readonly<Record<EntityState | string, ImageRect>> {}
