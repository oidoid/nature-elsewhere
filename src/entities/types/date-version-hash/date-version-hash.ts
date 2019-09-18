import {EntityType} from '../../entity-type/entity-type'
import {Text} from '../text/text'

export interface DateVersionHash extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_DATE_VERSION_HASH
}
