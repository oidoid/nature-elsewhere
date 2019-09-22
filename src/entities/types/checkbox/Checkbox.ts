import {EntityType} from '../../entityType/EntityType'
import {Text} from '../text/Text'

export interface Checkbox extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_CHECKBOX
  checked: boolean
}
