import {AnimationID} from './animation-id'
import {AnimationIDConfig} from './animation-id-config'
import {ObjectUtil} from '../utils/object-util'

export namespace AnimationIDParser {
  export function parse(config: AnimationIDConfig): AnimationID {
    if (ObjectUtil.isValueOf(AnimationID, config)) return config
    throw new Error(`Unknown AnimationID "${config}".`)
  }
}
