import {EntityState} from '../../entities/entityState/EntityState'
import {ImageRect} from '../imageRect/ImageRect'

export interface ImageStateMap
  extends Readonly<Record<EntityState | string, ImageRect>> {}
