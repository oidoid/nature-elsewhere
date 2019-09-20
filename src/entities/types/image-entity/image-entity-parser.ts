import {ImageEntity} from './image-entity'
import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {ImageParser} from '../../../images/image/image-parser'
import {EntityUtil} from '../../entity/entity-util'
import {ImageEntityConfig} from './image-entity-config'
import {Atlas} from '../../../atlas/atlas/atlas'

export namespace ImageEntityParser {
  export function parse(imageEntity: Entity, atlas: Atlas): ImageEntity {
    if (!EntityTypeUtil.assert<ImageEntity>(imageEntity, EntityType.IMAGE))
      throw new Error()
    const imageConfig = (<ImageEntityConfig>(<unknown>imageEntity)).image
    if (imageConfig) {
      const image = ImageParser.parse(imageConfig, atlas)
      EntityUtil.imageState(imageEntity).images.push(image)
    }
    return imageEntity
  }
}
