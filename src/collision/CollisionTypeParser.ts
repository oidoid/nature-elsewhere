import {CollisionType} from './CollisionType'
import {CollisionTypeConfig} from './CollisionTypeConfig'

export namespace CollisionTypeParser {
  export function parse(config: CollisionTypeConfig): CollisionType {
    if (config === undefined) return CollisionType.INERT
    assertType(config)
    return config
  }
}

function assertType(type: CollisionType): void {
  for (let bit = 1; bit <= type; bit <<= 1)
    if (bit & type && !(bit in CollisionType))
      throw new Error(`Unknown CollisionType "${bit}".`)
}
