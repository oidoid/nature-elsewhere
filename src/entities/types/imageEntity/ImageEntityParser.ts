import {ImageEntity} from './ImageEntity'
import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {ImageParser} from '../../../images/image/ImageParser'
import {EntityUtil} from '../../entity/EntityUtil'
import {ImageEntityConfig} from './ImageEntityConfig'
import {Atlas} from '../../../atlas/atlas/Atlas'

export namespace ImageEntityParser {
  export function parse(imageEntity: Entity, atlas: Atlas): ImageEntity {
    if (!EntityTypeUtil.assert<ImageEntity>(imageEntity, EntityType.IMAGE))
      throw new Error()
    const imageConfig = (<ImageEntityConfig>(<unknown>imageEntity)).image
    if (imageConfig) {
      const image = ImageParser.parse(imageConfig, atlas)
      EntityUtil.imageRect(imageEntity).images.push(image)
    }
    return imageEntity
  }
}
