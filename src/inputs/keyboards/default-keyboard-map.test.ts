import * as defaultKeyboardMap from '../../assets/inputs/default-keyboard-map.json'
import {InputBit} from '../input-bit/input-bit'

test.each(Object.values(defaultKeyboardMap))(
  '%# bit %p is an InputBit key',
  id => expect(id in InputBit).toBeTruthy()
)
