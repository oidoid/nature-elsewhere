import {Atlas} from 'aseprite-atlas'
import {Entity} from '../../../entity/Entity'
import {EntityConfig} from '../../../entity/EntityParser'
import {ImageConfig, ImageParser} from '../../../image/ImageParser'

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
      image.moveBy(entity.bounds.position)
      entity.addImages(image)
    }
    return entity
  }
}
