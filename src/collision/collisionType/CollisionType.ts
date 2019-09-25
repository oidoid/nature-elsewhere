export enum CollisionType {
  NONE = 0,
  SCENERY = 1 << 0,
  /** For example, deep water. */
  DEEP = 1 << 1,
  CHAR = 1 << 2,
  HARM = 1 << 3
}

export namespace CollisionType {
  export type Key = keyof typeof CollisionType
}
