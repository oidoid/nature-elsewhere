import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {Text} from '../text/text'

export interface TextEntity extends Entity {
  readonly id: 'text'
  readonly text: string
}

export namespace TextEntity {
  export const make = (atlas: Atlas, entity: Entity): Entity => {
    if (!isTextEntityConfig(entity))
      throw new Error(`Unknown ID "${entity.id}".`)
    const images = Text.toImages(atlas, entity.text || '')
    return {...entity, states: {'0': {x: 0, y: 0, w: 0, h: 0, images}}}
  }

  const isTextEntityConfig = (val: Entity): val is TextEntity =>
    val.id === 'text'
}
