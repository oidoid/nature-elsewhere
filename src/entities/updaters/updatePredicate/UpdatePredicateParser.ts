import {ObjectUtil} from '../../../utils/ObjectUtil'
import {UpdatePredicate} from './UpdatePredicate'

export type UpdatePredicateConfig = Maybe<UpdatePredicate | string>

export namespace UpdatePredicateParser {
  export function parse(config: UpdatePredicateConfig): UpdatePredicate {
    const predicate = config || UpdatePredicate.INTERSECTS_VIEWPORT
    if (ObjectUtil.assertValueOf(UpdatePredicate, predicate, 'UpdatePredicate'))
      return predicate
    throw new Error()
  }
}
