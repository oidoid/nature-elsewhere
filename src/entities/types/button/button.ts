import {Entity} from '../../entity/entity'
import {EntityState} from '../../entity-state/entity-state'
import {AtlasID} from '../../../atlas/atlas-id/atlas-id'
import {EntityType} from '../../entity-type/entity-type'
import {ButtonState} from './button-state'

export interface Button extends Entity {
  readonly type: EntityType.UI_BUTTON
  state: EntityState | ButtonState
  iconID: AtlasID
  clicked: boolean
}
