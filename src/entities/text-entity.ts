import {Atlas} from '../atlas/atlas'
import {Entity} from './entity'
import {Text} from '../text/text'

export namespace TextEntity {
  export interface Config extends Entity.Config {
    readonly id: 'text'
    readonly text?: string
  }

  export function make(atlas: Atlas, {x, y, ...entity}: Entity): Entity {
    if (!isTextEntityConfig(entity))
      throw new Error(`Unknown ID "${entity.id}".`)
    const images = Text.toImages(atlas, entity.text || '', {x, y})
    return {...entity, x, y, images}
  }

  function isTextEntityConfig(val: Entity.Config): val is Config {
    return val.id === 'text'
  }
}
