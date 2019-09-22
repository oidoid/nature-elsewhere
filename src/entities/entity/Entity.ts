import {EntityID} from '../entityID/EntityID'
import {EntityState} from '../entityState/EntityState'
import {EntityType} from '../entityType/EntityType'
import {ImageStateMap} from '../../images/imageStateMap/ImageStateMap'
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
  readonly bounds: Writable<Rect>
  // [todo] a string superset isn't ideal but a template param is needed
  //        otherwise for specialization.
  state: EntityState | string
  /** Images in level coordinates. These should usually only be passed
      statically by the entity configuration JSON. If additional imagery is
      needed, it is often best to add a child instead. */
  readonly imageStates: ImageStateMap
  readonly updatePredicate: UpdatePredicate
  /** See UpdatePredicate. */
  readonly updaters: readonly UpdaterType[]
  readonly collisionPredicate: CollisionPredicate
  /** Collision bodies in level coordinates. Check for bounds intersection
      before testing each body. Images should not be considered directly for
      collision tests. */
  readonly collisionBodies: readonly Writable<Rect>[] // Move to CollisionBody with CollisionType prop
  /** Operations are shallow by default (do not recurse children) unless
      specified otherwise. That is, only translation and animation are
      recursive. */
  readonly children: Entity[]
}
