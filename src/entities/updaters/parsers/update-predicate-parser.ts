import {ObjectUtil} from '../../../utils/object-util'
import {UpdatePredicate} from '../update-predicate'
import {UpdatePredicateConfig} from './update-predicate-config'

export namespace UpdatePredicateParser {
  export function parse(config: UpdatePredicateConfig): UpdatePredicate {
    const predicate = config || UpdatePredicate.INTERSECT_VIEWPORT
    return ObjectUtil.assertValueOf(
      UpdatePredicate,
      'UpdatePredicate',
      predicate
    )
  }
}
