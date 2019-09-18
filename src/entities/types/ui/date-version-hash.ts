import {EntityType} from '../entity-type'
import {Text} from './text'

export interface DateVersionHash extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_DATE_VERSION_HASH
}
