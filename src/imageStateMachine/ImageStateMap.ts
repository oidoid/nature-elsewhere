import {Entity} from '../entity/Entity'
import {ImageRect} from './ImageRect'

export interface ImageStateMap
  extends Readonly<Record<Entity.State | string, ImageRect>> {}

export namespace ImageStateMap {
  export function make(): ImageStateMap {
    return {[Entity.State.HIDDEN]: ImageRect.make()}
  }
}
