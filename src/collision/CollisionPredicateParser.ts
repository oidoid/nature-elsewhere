import {CollisionPredicate} from './CollisionPredicate'
import {ObjectUtil} from '../utils/ObjectUtil'

export type CollisionPredicateConfig = Maybe<CollisionPredicate | string>

export namespace CollisionPredicateParser {
  export function parse(config: CollisionPredicateConfig): CollisionPredicate {
    const predicate = config || CollisionPredicate.NEVER
    if (
      ObjectUtil.assertValueOf(
        CollisionPredicate,
        predicate,
        'CollisionPredicate'
      )
    )
      return predicate
    throw new Error()
  }
}
