import {ImageRect} from '../imageRect/ImageRect'
import {Entity} from '../../entity/Entity'

export interface ImageStateMap
  extends Readonly<Record<Entity.State | string, ImageRect>> {}
