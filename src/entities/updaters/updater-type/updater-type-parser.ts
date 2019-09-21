import {ObjectUtil} from '../../../utils/object-util'
import {UpdaterType} from './updater-type'
import {UpdaterTypeConfig, UpdaterTypeArrayConfig} from './updater-type-config'

export namespace UpdaterTypeParser {
  export function parseAll(config: UpdaterTypeArrayConfig): UpdaterType[] {
    return (config || []).map(parse)
  }

  export function parse(config: UpdaterTypeConfig): UpdaterType {
    const type = config || UpdaterType.NO_UPDATE
    if (ObjectUtil.hasValue(UpdaterType, type)) return <UpdaterType>type
    throw new Error(`Unknown Updater "${type}".`)
  }
}
