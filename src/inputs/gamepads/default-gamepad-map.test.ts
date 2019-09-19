import * as defaultGamepadMap from '../../assets/inputs/default-gamepad-map.json'
import {InputBit} from '../input-bit/input-bit'

test.each(Object.values(defaultGamepadMap.buttons))(
  '%# button %p is an InputBit key',
  id => expect(id in InputBit).toBeTruthy()
)

test.each(Object.values(defaultGamepadMap.axes))(
  '%# axis %p is an InputBit key',
  id => expect(id in InputBit).toBeTruthy()
)
