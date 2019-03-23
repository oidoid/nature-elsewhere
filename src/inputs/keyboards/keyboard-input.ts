import {Input} from '../input'
import {InputSource} from '../input-source'

export interface KeyboardInput extends Input {
  readonly source: InputSource.KEYBOARD
}
