import * as defaultGamepadMap from '../../assets/inputs/default-gamepad-map.json'
import {InputBit} from '../input-bit'
import {ObjectUtil} from '../../utils/object-util'

test.each(ObjectUtil.values(defaultGamepadMap.buttons))(
  '%# button %p is an InputBit key',
  id => expect(id in InputBit).toBeTruthy()
)

test.each(ObjectUtil.values(defaultGamepadMap.axes))(
  '%# axis %p is an InputBit key',
  id => expect(id in InputBit).toBeTruthy()
)
