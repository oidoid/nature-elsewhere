import {LevelType} from './LevelType'
import {LevelTypeConfig} from './LevelTypeConfig'

export namespace LevelTypeParser {
  export function parse(config: LevelTypeConfig): LevelType {
    if (Object.values(LevelType).includes(<LevelType>config))
      return <LevelType>config
    throw new Error(`Unknown LevelType "${config}.`)
  }
}
