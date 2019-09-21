import {TestUtil} from '../../../utils/TestUtil'
import {UpdateStatus} from './UpdateStatus'
import {ObjectUtil} from '../../../utils/ObjectUtil'

TestUtil.testValuesAreUnique(UpdateStatus, 'UpdateStatus')
TestUtil.testValuesArePositivePowerOfTwo(<number[]>ObjectUtil.values(
  UpdateStatus
)
  .filter(val => typeof val === 'number')
  .filter(val => val !== UpdateStatus.UNCHANGED))
