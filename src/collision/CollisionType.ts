/** Different collision classifications. For example, a deep pond could specify
    both deep and harm (drowning) collision types. This pond may not need to
    check for collision with other entities but the backpacker and bunny should
    probably check for collision with it. */
export enum CollisionType {
  /** Collision detection with the owner is possible but collisions have no
      default effect on the owner or interactor. */
  INERT = 0,

  /** Collisions obstruct the interactor's movement. When a moving interactor
      collides with an OBSTACLE owner, such as a tree, the moving entity should
      not be permitted to overlap boundaries with it. */
  OBSTACLE = 1 << 0,

  /** The collision owner is near an obstacle. */
  NEAR_OBSTACLE = 1 << 1,

  /** Collisions impede the interactor's movement but do not obstruct. Overlap
      between the owner and interactor's boundaries is permitted. */
  IMPEDIMENT = 1 << 2,

  /** The collision owner is near an obstacle. */
  NEAR_IMPEDIMENT = 1 << 3,

  /** Collisions indicate a movement impediment for the interactor that is
      obscured. E.g., knee-deep water. This may be represented by vertically
      truncating the entering interactor at the knees, for example. */
  DEEP_WATER = 1 << 4,

  /** The collision owner is a scenery type such as a tree or a cloud. */
  TYPE_SCENERY = 1 << 5,

  /** The collision owner is a character type such as a bee. */
  TYPE_CHARACTER = 1 << 6,

  /** The collision owner is a user interface type such as a button or a
      toolbar. */
  TYPE_UI = 1 << 7,

  /** The collision owner is the backpacker. */
  TYPE_BACKPACKER = 1 << 8,

  /** The collision owner is near the backpacker. */
  NEAR_TYPE_BACKPACKER = 1 << 9,

  /** The interactor may receive damage upon collision with the owner. */
  HARMFUL = 1 << 10,

  /** The collision owner is near a harmful owner. */
  NEAR_HARMFUL = 1 << 11,

  /** The interactor may die instantly upon collision with the owner. */
  FATAL = 1 << 12,

  /** The collision owner is near a fatal owner. */
  NEAR_FATAL = 1 << 13
}

export namespace CollisionType {
  export type Key = keyof typeof CollisionType
}
