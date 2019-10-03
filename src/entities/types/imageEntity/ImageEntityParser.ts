import {Atlas} from 'aseprite-atlas'
import {Entity} from '../../../entity/Entity'
import {EntityConfig} from '../../../entity/EntityParser'
import {ImageConfig, ImageParser} from '../../../image/ImageParser'
import {ImageRect} from '../../../imageStateMachine/ImageRect'
import {Image} from '../../../image/Image'

export interface ImageEntityConfig extends EntityConfig {
  /** A single image to be added to the default state. */
  readonly image?: ImageConfig
}

export namespace ImageEntityParser {
  export function parse(
    config: ImageEntityConfig,
    props: Entity.Props,
    atlas: Atlas
  ): Entity {
    const entity = new Entity(props)
    if (config.image) {
      const image = ImageParser.parse(config.image, atlas)
      Image.moveBy(image, entity.bounds.position)
      ImageRect.add(entity.imageRect(), image) // not great. more encapsulation pls
      entity.invalidateBounds() // this ain't goood}
    }
    return entity
  }
}
