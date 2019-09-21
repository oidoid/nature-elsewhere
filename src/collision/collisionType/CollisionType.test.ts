import {CollisionType} from './CollisionType'
import {TestUtil} from '../../utils/TestUtil'
import {ObjectUtil} from '../../utils/ObjectUtil'

TestUtil.testValuesAreUnique(CollisionType, 'CollisionType')
TestUtil.testValuesArePositivePowerOfTwo(<number[]>ObjectUtil.values(
  CollisionType
)
  .filter(val => typeof val === 'number')
  .filter(val => val !== CollisionType.NONE))
