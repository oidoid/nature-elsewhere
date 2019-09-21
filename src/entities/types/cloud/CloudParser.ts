import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'
import {Cloud} from './Cloud'
import {ObjectUtil} from '../../../utils/ObjectUtil'
import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {CloudState} from './CloudState'
import {EntityState} from '../../entityState/EntityState'

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
