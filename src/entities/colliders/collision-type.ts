export enum CollisionType {
  NONE = 0b000,
  SCENERY = 0b001,
  /** For example, deep water. */
  DEEP = 0b0010,
  CHAR = 0b0100,
  HARM = 0b1000
}

export namespace CollisionType {
  export type Key = keyof typeof CollisionType
}
