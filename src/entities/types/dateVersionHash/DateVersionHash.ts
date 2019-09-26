import {EntityType} from '../../entity/EntityType'
import {Text} from '../text/Text'

export interface DateVersionHash extends Omit<Text, 'type'> {
  readonly type: EntityType.UI_DATE_VERSION_HASH
}
