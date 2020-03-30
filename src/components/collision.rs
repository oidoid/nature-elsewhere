use crate::math::R16;
use serde::Deserialize;
use specs::prelude::DenseVecStorage;
use specs::Component;

/// Different collision classifications. For example, a deep pond could specify
/// both deep and harm (drowning) collision types. This pond may not need to
/// check for collision with other entities but the backpacker and bunny should
/// probably check for collision with it.
#[derive(Clone, Copy, Debug, Deserialize, PartialEq)]
pub enum CollidesWith {
  /// Collision detection with the owner is possible but collisions have no
  /// default effect on the owner or initiator.
  Inert = 0,

  /// Collisions obstruct the initiator's movement. When a moving initiator
  /// collides with an OBSTACLE owner, such as a tree, the moving entity should
  /// not be permitted to overlap boundaries with it.
  Obstacle = 1 << 0,

  /// The collision owner is near an obstacle.
  NearObstacle = 1 << 1,

  /// Collisions impede the initiator's movement but do not obstruct. Overlap
  /// between the owner and initiator's boundaries is permitted.
  Impediment = 1 << 2,

  /// The collision owner is near an obstacle.
  NearImpediment = 1 << 3,

  /// Collisions indicate a movement impediment for the initiator that is
  /// obscured. E.g., knee-deep water. This may be represented by vertically
  /// truncating the entering initiator at the knees, for example.
  DeepWater = 1 << 4,

  /// The collision owner is a scenery type such as a tree or a cloud.
  TypeScenery = 1 << 5,

  /// The collision owner is a character type such as a bee.
  TypeCharacter = 1 << 6,

  /// The collision owner is a user interface type such as a button or a
  /// toolbar.
  TypeUI = 1 << 7,

  /// The collision owner is the backpacker.
  TypeBackpacker = 1 << 8,

  /// The collision owner is near the backpacker.
  NearTypeBackpacker = 1 << 9,

  /// The collision owner is an item such as an arrow.
  TypeItem = 1 << 10,

  /// The collision owner is near an item owner.
  NearTypeItem = 1 << 11,

  /// The initiator may receive damage upon collision with the owner.
  Harmful = 1 << 12,

  /// The collision owner is near a harmful owner.
  NearHarmful = 1 << 13,

  /// The initiator may die instantly upon collision with the owner.
  Fatal = 1 << 14,

  /// The collision owner is near a fatal owner.
  NearFatal = 1 << 15,
}

#[derive(Component, Clone)]
pub struct Collision {
  pub bodies: Vec<R16>,
}
