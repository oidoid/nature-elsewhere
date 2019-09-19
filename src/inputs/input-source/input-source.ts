/** Distinct input sources are coalesced by the Recorder. Inputs from the same
    source are overwritten unless their adapter provides otherwise. */
// prettier-ignore
export enum InputSource {
  KEYBOARD      = 0b0001,
  POINTER_PICK  = 0b0010,
  POINTER_POINT = 0b0100,
  GAMEPAD       = 0b1000
}
