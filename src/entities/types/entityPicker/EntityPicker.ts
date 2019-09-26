import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'

export interface EntityPicker extends Entity {
  readonly type: EntityType.UI_ENTITY_PICKER
  activeChildIndex: number
}
