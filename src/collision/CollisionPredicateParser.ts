import {CollisionPredicate} from './CollisionPredicate'
import {CollisionPredicateConfig} from './CollisionPredicateConfig'

export namespace CollisionPredicateParser {
  export function parse(config: CollisionPredicateConfig): CollisionPredicate {
    if (config === undefined) return CollisionPredicate.NEVER
    assertType(config)
    return config
  }
}

function assertType(predicate: CollisionPredicate): void {
  for (let bit = 1; bit <= predicate; bit <<= 1)
    if (bit & predicate && !(bit in CollisionPredicate))
      throw new Error(`Unknown CollisionPredicate "${bit}".`)
}
