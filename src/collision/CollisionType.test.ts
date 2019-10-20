import {CollisionType} from './CollisionType'
import {TestUtil} from '../utils/TestUtil'

TestUtil.testValuesAreUnique(CollisionType, 'CollisionType')
TestUtil.testValuesArePositivePowerOfTwo(
  <number[]>(
    Object.values(CollisionType).filter(
      val => typeof val === 'number' && val !== CollisionType.INERT
    )
  )
)
