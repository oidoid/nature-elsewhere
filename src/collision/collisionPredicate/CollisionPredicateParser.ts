import {CollisionPredicate} from './CollisionPredicate'
import {CollisionPredicateConfig} from './CollisionPredicateConfig'
import {ObjectUtil} from '../../utils/ObjectUtil'

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
