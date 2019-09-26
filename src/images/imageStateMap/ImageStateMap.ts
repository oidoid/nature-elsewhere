import {ImageRect} from '../imageRect/ImageRect'
import {Entity} from '../../entities/entity/Entity'

export interface ImageStateMap
  extends Readonly<Record<Entity.State | string, ImageRect>> {}
