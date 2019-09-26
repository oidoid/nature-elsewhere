import {EntityType} from '../../entity/EntityType'
import {Text} from '../text/Text'

export interface Checkbox extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_CHECKBOX
  checked: boolean
}
export namespace Checkbox {
  export enum State {
    UNCHECKED = 'unchecked',
    CHECKED = 'checked'
  }
}
