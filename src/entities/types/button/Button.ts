import {Entity} from '../../entity/Entity'
import {EntityState} from '../../entityState/EntityState'
import {EntityType} from '../../entityType/EntityType'
import {ButtonState} from './ButtonState'

export interface Button extends Entity {
  readonly type: EntityType.UI_BUTTON
  state: EntityState | ButtonState
  clicked: boolean
}
