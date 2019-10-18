import {CollisionPredicate} from './CollisionPredicate'
import {TestUtil} from '../utils/TestUtil'
import {ObjectUtil} from '../utils/ObjectUtil'

TestUtil.testValuesAreUnique(CollisionPredicate, 'CollisionPredicate')
TestUtil.testValuesArePositivePowerOfTwo(
  ObjectUtil.values(CollisionPredicate).filter(
    val => typeof val === 'number' && val !== CollisionPredicate.NEVER
  )
)
