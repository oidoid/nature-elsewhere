import * as defaultKeyboardMap from '../../assets/inputs/default-keyboard-map.json'
import {InputBit} from '../input-bit'
import {ObjectUtil} from '../../utils/object-util'

test.each(ObjectUtil.values(defaultKeyboardMap))(
  '%# bit %p is an InputBit key',
  id => expect(id in InputBit).toBeTruthy()
)
