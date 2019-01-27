// prettier-ignore
export enum InputMask {
  LEFT =               0b0_0000_0000_0001,
  RIGHT =              0b0_0000_0000_0010,
  UP =                 0b0_0000_0000_0100,
  DOWN =               0b0_0000_0000_1000,
  MENU =               0b0_0000_0001_0000,
  DEBUG_CONTEXT_LOSS = 0b0_0000_0010_0000,
  SCALE_RESET =        0b0_0000_0100_0000,
  SCALE_INCREASE =     0b0_0000_1000_0000,
  SCALE_DECREASE =     0b0_0001_0000_0000,
  POINT =              0b0_0010_0000_0000,
  PICK =               0b0_0100_0000_0000,
  PREV_ENTITY =        0b0_1000_0000_0000,
  NEXT_ENTITY =        0b1_0000_0000_0000
}
