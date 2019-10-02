import {Entity} from '../entity/Entity'
import {ImageRect} from './ImageRect'
import {XY} from '../math/XY'

export interface ImageStateMap
  extends Readonly<Record<Entity.State | string, ImageRect>> {}

export namespace ImageStateMap {
  export function make(scale?: XY): ImageStateMap {
    return {[Entity.State.HIDDEN]: ImageRect.make(scale)}
  }
}
