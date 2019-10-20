import {LevelType} from './LevelType'

export type LevelTypeConfig = LevelType | string

export namespace LevelTypeParser {
  export function parse(config: LevelTypeConfig): LevelType {
    if (Object.values(LevelType).includes(<LevelType>config))
      return <LevelType>config
    throw new Error(`Unknown LevelType "${config}.`)
  }
}
