import {AtlasID} from './AtlasID'
import {AtlasIDConfig} from './AtlasIDConfig'
import {ObjectUtil} from '../../utils/ObjectUtil'

export namespace AtlasIDParser {
  export function parse(config: AtlasIDConfig): AtlasID {
    if (ObjectUtil.assertValueOf(AtlasID, config, 'AtlasID')) return config
    throw new Error()
  }
}
