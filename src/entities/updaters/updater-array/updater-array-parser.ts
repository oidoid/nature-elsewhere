import {UpdaterArrayConfig} from './updater-array-config'
import {Updater} from '../updater/updater'
import {UpdaterParser} from '../updater/updater-parser'

export namespace UpdaterArrayParser {
  export function parse(config: UpdaterArrayConfig): Updater[] {
    return (config || []).map(UpdaterParser.parse)
  }
}
