import {Updater} from '../updater/updater'
import {UpdaterParser} from '../updater/updater-parser'
import {UpdaterArrayConfig} from '../updater-array/updater-array-config'

export namespace UpdaterArrayParser {
  export function parse(config: UpdaterArrayConfig): Updater[] {
    return (config || []).map(UpdaterParser.parse)
  }
}
