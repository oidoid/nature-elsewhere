import {ImageEntity} from './ImageEntity'
import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {ImageConfig, ImageParser} from '../../../image/ImageParser'
import {Atlas} from '../../../atlas/Atlas'
import {EntityConfig} from '../../../entity/EntityParser'
import {ImageRect} from '../../../imageStateMachine/ImageRect'

export interface ImageEntityConfig extends EntityConfig {
  /** A single image to be added to the default state. */
  readonly image?: ImageConfig
}

export namespace ImageEntityParser {
  export function parse(imageEntity: Entity, atlas: Atlas): ImageEntity {
    if (!Entity.assert<ImageEntity>(imageEntity, EntityType.IMAGE))
      throw new Error()
    const imageConfig = (<ImageEntityConfig>(<unknown>imageEntity)).image
    if (imageConfig) {
      const image = ImageParser.parse(imageConfig, atlas)
      ImageRect.add(Entity.imageRect(imageEntity), image)
      Entity.invalidateBounds(imageEntity)
    }
    return imageEntity
  }
}
