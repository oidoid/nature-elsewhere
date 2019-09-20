import {EntityState} from '../../entity-state/entity-state'
import {EntityType} from '../../entity-type/entity-type'
import {Text} from '../text/text'
import {CheckboxState} from './checkbox-state'

export interface Checkbox extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_CHECKBOX
  state: EntityState | CheckboxState
  checked: boolean
}
