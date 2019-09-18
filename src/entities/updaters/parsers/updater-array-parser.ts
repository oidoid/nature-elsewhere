import {UpdaterArrayConfig} from './updater-array-config'
import {Updater} from '../updater'
import {UpdaterParser} from './updater-parser'

export namespace UpdaterArrayParser {
  export function parse(config: UpdaterArrayConfig): Updater[] {
    return (config || []).map(UpdaterParser.parse)
  }
}
