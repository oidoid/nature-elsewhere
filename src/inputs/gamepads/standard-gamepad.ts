// https://w3c.github.io/gamepad/#remapping

export enum StandardButton {
  X = 0,
  CIRCLE = 1,
  SQUARE = 2,
  TRIANGLE = 3,
  L1 = 4,
  R1 = 5,
  L2 = 6,
  R2 = 7,
  SELECT = 8,
  START = 9,
  L3 = 10,
  R3 = 11,
  DPAD_UP = 12,
  DPAD_DOWN = 13,
  DPAD_LEFT = 14,
  DPAD_RIGHT = 15
}

export enum StandardAxis {
  LEFT_HORIZONTAL = 0,
  LEFT_VERTICAL = 1,
  RIGHT_HORIZONTAL = 2,
  RIGHT_VERTICAL = 3
}

export enum StandardAxisDirection {
  UP = -1,
  DOWN = 1,
  LEFT = -1,
  RIGHT = 1
}
