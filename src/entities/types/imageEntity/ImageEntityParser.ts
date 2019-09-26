import {ImageEntity} from './ImageEntity'
import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

import {ImageParser} from '../../../images/image/ImageParser'

import {ImageEntityConfig} from './ImageEntityConfig'
import {Atlas} from '../../../atlas/atlas/Atlas'

export namespace ImageEntityParser {
  export function parse(imageEntity: Entity, atlas: Atlas): ImageEntity {
    if (!Entity.assert<ImageEntity>(imageEntity, EntityType.IMAGE))
      throw new Error()
    const imageConfig = (<ImageEntityConfig>(<unknown>imageEntity)).image
    if (imageConfig) {
      const image = ImageParser.parse(imageConfig, atlas)
      Entity.imageRect(imageEntity).images.push(image)
    }
    return imageEntity
  }
}
