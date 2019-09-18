import {CollisionType} from './collision-type'
import {TestUtil} from '../../utils/test-util'
import {ObjectUtil} from '../../utils/object-util'

TestUtil.testValuesAreUnique(CollisionType, 'CollisionType')
TestUtil.testValuesArePositivePowerOfTwo(<number[]>ObjectUtil.values(
  CollisionType
)
  .filter(val => typeof val === 'number')
  .filter(val => val !== CollisionType.NONE))
