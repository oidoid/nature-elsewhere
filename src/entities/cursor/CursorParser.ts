import {Cursor} from './Cursor'
import {CursorPropsConfig} from './CursorPropsConfig'

export namespace CursorParser {
  export function parseProps(config: CursorPropsConfig): Cursor.Props {
    if (config === undefined || config.icon === undefined) return {}
    if (Object.values(Cursor.Icon).includes(<Cursor.Icon>config.icon))
      return {icon: <Cursor.Icon>config.icon}
    throw new Error(`Unknown CursorIcon "${config.icon}".`)
  }
}
