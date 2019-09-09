import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {TextLayout} from '../text/text-layout'

export interface TextEntity extends Entity {
  readonly id: 'text'
  readonly text: string
}
type t = TextEntity

export namespace TextEntity {
  export const make = (atlas: Atlas, entity: Entity): t => {
    if (!isTextEntityConfig(entity))
      throw new Error(`Unknown ID "${entity.id}".`)
    const images = TextLayout.toImages(atlas, entity.text || '')
    return {...entity, states: {'0': {x: 0, y: 0, w: 0, h: 0, images}}}
  }

  const isTextEntityConfig = (val: Entity): val is t => val.id === 'text'
}
