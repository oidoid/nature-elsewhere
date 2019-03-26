/** Distinct input sources are coalesced by the Recorder. Inputs from the same
    source are overwritten unless their adapter provides otherwise. */
// prettier-ignore
export enum InputSource {
  KEYBOARD                          = 0b0000_0001,
  MOUSE_PICK                        = 0b0000_0010,
  MOUSE_POINT                       = 0b0000_0100,
  GAMEPAD                           = 0b0000_1000,
  VIRTUAL_GAMEPAD_JOYSTICK_POSITION = 0b0001_0000,
  VIRTUAL_GAMEPAD_JOYSTICK_AXES     = 0b0010_0000,
  VIRTUAL_GAMEPAD_BUTTONS_POSITION  = 0b0100_0000,
  VIRTUAL_GAMEPAD_BUTTONS_PRESSED   = 0b1000_0000
}
