import {CollisionType} from './CollisionType'
import {ObjectUtil} from '../utils/ObjectUtil'

export type CollisionTypeConfig = Maybe<CollisionType>

export namespace CollisionTypeParser {
  export function parse(config: CollisionTypeConfig): CollisionType {
    if (config === undefined) return CollisionType.INERT
    assertType(config)
    return config
  }
}

function assertType(type: CollisionType): void {
  for (let bit = 1; bit <= type; bit <<= 1)
    if (bit & type) ObjectUtil.assertKeyOf(CollisionType, bit, 'CollisionType')
}
