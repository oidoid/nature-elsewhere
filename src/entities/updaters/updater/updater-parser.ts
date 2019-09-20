import {ObjectUtil} from '../../../utils/object-util'
import {Updater} from './updater'
import {UpdaterConfig, UpdaterArrayConfig} from './updater-config'

export namespace UpdaterParser {
  export function parseAll(config: UpdaterArrayConfig): Updater[] {
    return (config || []).map(parse)
  }

  export function parse(config: UpdaterConfig): Updater {
    const updater = config || Updater.NO_UPDATE
    if (ObjectUtil.isValueOf(Updater, updater)) return <Updater>updater
    throw new Error(`Unknown Updater "${updater}".`)
  }
}
