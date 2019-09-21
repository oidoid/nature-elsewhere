import {ObjectUtil} from '../../utils/object-util'
import {LevelTypeConfig} from './level-type-config'
import {LevelType} from './level-type'

export namespace LevelTypeParser {
  export function parse(config: LevelTypeConfig): LevelType {
    if (ObjectUtil.assertValueOf(LevelType, config, 'LevelType')) return config
    throw new Error()
  }
}
