/** Distinct input sources are coalesced by the Recorder. Inputs from the same
    source are overwritten unless their adapter provides otherwise. */
// prettier-ignore
export enum InputSource {
  KEYBOARD                          = 0b000001,
  MOUSE_PICK                        = 0b000010,
  MOUSE_POINT                       = 0b000100,
  GAMEPAD                           = 0b001000,
  VIRTUAL_GAMEPAD_JOYSTICK_POSITION = 0b010000,
  VIRTUAL_GAMEPAD_JOYSTICK_AXES     = 0b100000
}
