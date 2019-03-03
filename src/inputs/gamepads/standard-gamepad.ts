// https://w3c.github.io/gamepad/#remapping

export namespace StandardGamepad {
  export enum Button {
    X,
    CIRCLE,
    SQUARE,
    TRIANGLE,
    L1,
    R1,
    L2,
    R2,
    SELECT,
    START,
    L3,
    R3,
    DPAD_UP,
    DPAD_DOWN,
    DPAD_LEFT,
    DPAD_RIGHT
  }

  export enum Axis {
    LEFT_HORIZONTAL,
    LEFT_VERTICAL,
    RIGHT_HORIZONTAL,
    RIGHT_VERTICAL
  }

  export enum AxisDirection {
    UP = -1,
    DOWN = 1,
    LEFT = -1,
    RIGHT = 1
  }
}
