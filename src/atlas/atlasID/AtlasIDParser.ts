import {AtlasID} from './AtlasID'
import {ObjectUtil} from '../../utils/ObjectUtil'

export type AtlasIDConfig = AtlasID | string

export namespace AtlasIDParser {
  export function parse(config: AtlasIDConfig): AtlasID {
    if (ObjectUtil.assertValueOf(AtlasID, config, 'AtlasID')) return config
    throw new Error()
  }
}
