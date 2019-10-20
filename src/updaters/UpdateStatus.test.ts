import {TestUtil} from '../utils/TestUtil'
import {UpdateStatus} from './UpdateStatus'

TestUtil.testValuesAreUnique(UpdateStatus, 'UpdateStatus')
TestUtil.testValuesArePositivePowerOfTwo(
  <number[]>Object.values(UpdateStatus)
    .filter(val => typeof val === 'number')
    .filter(val => val !== UpdateStatus.UNCHANGED)
)
