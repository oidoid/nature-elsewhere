import {EntityID} from '../entityID/EntityID'
import {EntityType} from '../entityType/EntityType'
import {ImageStateMachine} from '../../images/imageStateMachine/ImageStateMachine'
import {Rect} from '../../math/rect/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {CollisionPredicate} from '../../collision/collisionPredicate/CollisionPredicate'

export interface Entity {
  /** A globally unique identifier for quick equality checks. It should be used
      for no other purpose. The value is transient and should not be preserved
      on entity serialization. */
  readonly spawnID: symbol
  readonly id: EntityID
  readonly type: EntityType
  /** The local coordinate system or minimal union of the entity and all of its
      children given in level coordinates with origin at (x, y). All images,
      collisions, and children are always in bounds and are also specified in
      level coordinates, not coordinates relative the local entity origin. This
      local coordinate system is necessary for calculating absolute translations
      (moveTo), and quick cached collision and layout checks such as determining
      if the entity is on screen. All of these states must be kept in sync. */
  readonly bounds: Rect
  readonly machine: ImageStateMachine
  readonly updatePredicate: UpdatePredicate
  /** See UpdatePredicate. */
  readonly updaters: readonly UpdaterType[]
  readonly collisionPredicate: CollisionPredicate
  /** Collision bodies in level coordinates. Check for bounds intersection
      before testing each body. Images should not be considered directly for
      collision tests. */
  readonly collisionBodies: readonly Rect[] // Move to CollisionBody with CollisionType prop
  /** Operations are shallow by default (do not recurse children) unless
      specified otherwise. That is, only translation and animation are
      recursive. */
  readonly children: Entity[]
}
