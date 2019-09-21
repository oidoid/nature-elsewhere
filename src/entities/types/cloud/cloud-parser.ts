import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {Cloud} from './cloud'
import {ObjectUtil} from '../../../utils/object-util'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {CloudState} from './cloud-state'
import {EntityState} from '../../entity-state/entity-state'

export namespace CloudParser {
  export function parse(cloud: Entity): Cloud {
    if (!EntityTypeUtil.assert<Cloud>(cloud, EntityType.SCENERY_CLOUD))
      throw new Error()
    if (
      ObjectUtil.isValueOf(EntityState, cloud.state) ||
      ObjectUtil.isValueOf(CloudState, cloud.state)
    )
      return cloud
    throw new Error(
      `EntityState and CloudState missing "${cloud.state}" value.`
    )
  }
}
