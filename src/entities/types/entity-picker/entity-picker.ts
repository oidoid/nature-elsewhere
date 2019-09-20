import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'

export interface EntityPicker extends Entity {
  readonly type: EntityType.UI_ENTITY_PICKER
  activeChildIndex: number
}
