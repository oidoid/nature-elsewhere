// prettier-ignore
export enum InputBit {
  LEFT =                      0b000_0000_0000_0001,
  RIGHT =                     0b000_0000_0000_0010,
  UP =                        0b000_0000_0000_0100,
  DOWN =                      0b000_0000_0000_1000,
  ACTION =                    0b000_0000_0001_0000,
  MENU =                      0b000_0000_0010_0000,
  DEBUG_CONTEXT_LOSS =        0b000_0000_0100_0000,
  SCALE_RESET =               0b000_0000_1000_0000,
  SCALE_INCREASE =            0b000_0001_0000_0000,
  SCALE_DECREASE =            0b000_0010_0000_0000,
  POINT =                     0b000_0100_0000_0000,
  PICK =                      0b000_1000_0000_0000,
  PREV_ENTITY =               0b001_0000_0000_0000,
  NEXT_ENTITY =               0b010_0000_0000_0000,
  POSITION_VIRTUAL_JOYSTICK = 0b100_0000_0000_0000
}
