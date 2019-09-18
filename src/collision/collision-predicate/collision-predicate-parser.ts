import {CollisionPredicate} from './collision-predicate'
import {CollisionPredicateConfig} from './collision-predicate-config'
import {ObjectUtil} from '../../utils/object-util'

export namespace CollisionPredicateParser {
  export function parse(config: CollisionPredicateConfig): CollisionPredicate {
    const predicate = config || CollisionPredicate.NEVER
    if (ObjectUtil.isValueOf(CollisionPredicate, predicate)) return predicate
    throw new Error(`Unknown CollisionPredicate "${predicate}".`)
  }
}
