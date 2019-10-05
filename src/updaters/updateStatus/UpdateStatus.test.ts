import {TestUtil} from '../../utils/TestUtil'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {UpdateStatus} from './UpdateStatus'

TestUtil.testValuesAreUnique(UpdateStatus, 'UpdateStatus')
TestUtil.testValuesArePositivePowerOfTwo(
  <number[]>ObjectUtil.values(UpdateStatus)
    .filter(val => typeof val === 'number')
    .filter(val => val !== UpdateStatus.UNCHANGED)
)
