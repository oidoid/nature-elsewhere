import {CollisionPredicate} from './CollisionPredicate'
import {TestUtil} from '../utils/TestUtil'

TestUtil.testValuesAreUnique(CollisionPredicate, 'CollisionPredicate')
TestUtil.testValuesArePositivePowerOfTwo(
  <number[]>(
    Object.values(CollisionPredicate).filter(
      val => typeof val === 'number' && val !== CollisionPredicate.NEVER
    )
  )
)
