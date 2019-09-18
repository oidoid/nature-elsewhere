import {TestUtil} from '../../../utils/test-util'
import {UpdateStatus} from './update-status'
import {ObjectUtil} from '../../../utils/object-util'

TestUtil.testValuesAreUnique(UpdateStatus, 'UpdateStatus')
TestUtil.testValuesArePositivePowerOfTwo(<number[]>ObjectUtil.values(
  UpdateStatus
)
  .filter(val => typeof val === 'number')
  .filter(val => val !== UpdateStatus.UNCHANGED))
