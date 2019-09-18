import {AtlasID} from './atlas-id'
import {AtlasIDConfig} from './atlas-id-config'
import {ObjectUtil} from '../utils/object-util'

export namespace AtlasIDParser {
  export function parse(config: AtlasIDConfig): AtlasID {
    if (ObjectUtil.isValueOf(AtlasID, config)) return config
    throw new Error(`Unknown AtlasID "${config}".`)
  }
}
