/** Different collision classifications. For example, a deep pond could specify
    both deep and harm (drowning) collision types. This pond may not need to
    check for collision with other entities but the backpacker and bunny should
    probably check for collision with it. */
export enum CollisionType {
  /** Collision detection with the owner is possible but collisions have no
      default effect on the owner or initiator. */
  INERT = 0,

  /** Collisions obstruct the initiator's movement. When a moving initiator
      collides with an OBSTACLE owner, such as a tree, the moving entity should
      not be permitted to overlap boundaries with it. */
  OBSTACLE = 1 << 0,

  /** The collision owner is near an obstacle. */
  NEAR_OBSTACLE = 1 << 1,

  /** Collisions impede the initiator's movement but do not obstruct. Overlap
      between the owner and initiator's boundaries is permitted. */
  IMPEDIMENT = 1 << 2,

  /** The collision owner is near an obstacle. */
  NEAR_IMPEDIMENT = 1 << 3,

  /** Collisions indicate a movement impediment for the initiator that is
      obscured. E.g., knee-deep water. This may be represented by vertically
      truncating the entering initiator at the knees, for example. */
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

  /** The collision owner is an item such as an arrow. */
  TYPE_ITEM = 1 << 10,

  /** The collision owner is near an item owner. */
  NEAR_TYPE_ITEM = 1 << 11,

  /** The initiator may receive damage upon collision with the owner. */
  HARMFUL = 1 << 12,

  /** The collision owner is near a harmful owner. */
  NEAR_HARMFUL = 1 << 13,

  /** The initiator may die instantly upon collision with the owner. */
  FATAL = 1 << 14,

  /** The collision owner is near a fatal owner. */
  NEAR_FATAL = 1 << 15
}
