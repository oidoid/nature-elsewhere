import {ObjectUtil} from '../../utils/ObjectUtil'
import {LevelTypeConfig} from './LevelTypeConfig'
import {LevelType} from './LevelType'

export namespace LevelTypeParser {
  export function parse(config: LevelTypeConfig): LevelType {
    if (ObjectUtil.assertValueOf(LevelType, config, 'LevelType')) return config
    throw new Error()
  }
}
