import {UpdatePredicate} from './UpdatePredicate'
import {UpdatePredicateConfig} from './UpdatePredicateConfig'

export namespace UpdatePredicateParser {
  export function parse(config: UpdatePredicateConfig): UpdatePredicate {
    const predicate = config || UpdatePredicate.INTERSECTS_VIEWPORT
    if (Object.values(UpdatePredicate).includes(<UpdatePredicate>predicate))
      return <UpdatePredicate>predicate
    throw new Error(`Unknown UpdatePredicate "${predicate}".`)
  }
}
