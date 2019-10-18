import {ObjectUtil} from '../utils/ObjectUtil'
import {LevelType} from './LevelType'

export type LevelTypeConfig = LevelType | string

export namespace LevelTypeParser {
  export function parse(config: LevelTypeConfig): LevelType {
    ObjectUtil.assertValueOf(LevelType, config, 'LevelType')
    return config
  }
}
