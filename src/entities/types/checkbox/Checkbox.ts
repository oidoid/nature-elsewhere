import {EntityState} from '../../entityState/EntityState'
import {EntityType} from '../../entityType/EntityType'
import {Text} from '../text/Text'
import {CheckboxState} from './CheckboxState'

export interface Checkbox extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_CHECKBOX
  state: EntityState | CheckboxState
  checked: boolean
}
