import {Cursor} from './Cursor'
import {EntityConfig} from '../../entity/EntityConfig'

export type CursorIconConfig = Cursor.Icon | string

export type CursorPropsConfig = Maybe<
  EntityConfig & {readonly icon?: CursorIconConfig}
>
