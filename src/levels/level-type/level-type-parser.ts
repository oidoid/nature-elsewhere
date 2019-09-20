import {ObjectUtil} from '../../utils/object-util'
import {LevelTypeConfig} from './level-type-config'
import {LevelType} from './level-type'

export namespace LevelTypeParser {
  export function parse(config: LevelTypeConfig): LevelType {
    if (ObjectUtil.hasValue(LevelType, config)) return config
    throw new Error(`Unknown LevelType "${config}".`)
  }
}
