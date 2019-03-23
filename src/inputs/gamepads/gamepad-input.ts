import {Input} from '../input'
import {InputSource} from '../input-source'

export interface GamepadInput extends Input {
  readonly source: InputSource.GAMEPAD
}
