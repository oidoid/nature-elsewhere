/** Distinct input sources are coalesced by the Recorder. Inputs from the same
    source are overwritten unless their adapter provides otherwise. */
export enum InputSource {
  KEYBOARD,
  MOUSE_PICK,
  MOUSE_POINT,
  GAMEPAD,
  VIRTUAL_GAMEPAD_JOYSTICK_POSITION,
  VIRTUAL_GAMEPAD_JOYSTICK_AXES
}
