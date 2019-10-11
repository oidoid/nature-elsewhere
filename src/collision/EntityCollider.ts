import {CollisionPredicate} from './CollisionPredicate'
import {Entity} from '../entity/Entity'
import {Rect} from '../math/Rect'
import {ArrayUtil} from '../utils/ArrayUtil'

export namespace EntityCollider {
  export function collidesEntities(
    initiator: Entity,
    entities: readonly Entity[]
  ): Entity[] {
    const collisions: Entity[] = []

    for (const entity of entities)
      collisions.push(...collidesEntity(initiator, entity))

    // Children are not shared so the collision array will not contain
    // duplicates.
    return collisions
  }

  export function collidesEntity(initiator: Entity, entity: Entity): Entity[] {
    const collisions: Entity[] = []
    if (
      initiator.collisionPredicate === CollisionPredicate.NEVER ||
      entity.collisionPredicate === CollisionPredicate.NEVER
    )
      // One or both of the entities have no collision.
      return collisions

    // The initiator and entity are identical.
    if (initiator.equal(entity)) return collisions

    // Both of the entities have collision.

    if (!Rect.intersects(initiator.bounds, entity.bounds))
      // Any collision requires both entities to intersect.
      return collisions

    // The entities intersect.

    if (initiator.collisionPredicate === CollisionPredicate.BOUNDS)
      // The initiator only has bounding rectangle collision. If the test entity
      // or its children collide with the initiator's bounds, a collision has
      // occurred.
      return entity.collidesRect(initiator.bounds)

    // The initiator has image, body, or children collision.

    if (initiator.collisionPredicate === CollisionPredicate.IMAGES) {
      // The initiator only has image collision. If the test entity or its
      // children collide with any of the initiator's images, a collision has
      // occurred. Otherwise, no collision has occurred.
      if (!Rect.intersects(initiator.imageBounds(), entity.bounds))
        return collisions
      for (const image of initiator.images())
        collisions.push(...entity.collidesRect(image.bounds))

      // Each image must be tested against the entity in case it has children so
      // that all collisions are reported. However, each collision should only
      // be reported once.
      return collisions.filter(ArrayUtil.unique((lhs, rhs) => lhs.equal(rhs)))
    }

    if (initiator.collisionPredicate === CollisionPredicate.BODIES) {
      // The initiator only has collision bodies. If the test entity or its
      // children collide with any of the initiator's bodies, a collision has
      // occurred. Otherwise, no collision has occurred.
      for (const body of initiator.collisionBodies)
        collisions.push(...entity.collidesRect(body))
      // Each body must be tested against the entity in case it has children so
      // that all collisions are reported. However, each collision should only
      // be reported once.
      return collisions.filter(ArrayUtil.unique((lhs, rhs) => lhs.equal(rhs)))
    }

    // The initiator has CollisionPredicate.CHILDREN.
    for (const child of initiator.children)
      collisions.push(...collidesEntity(child, entity))

    // Each child must be tested against the entity in case it has children so
    // that all collisions are reported. However, each collision should only
    // be reported once.
    return collisions.filter(ArrayUtil.unique((lhs, rhs) => lhs.equal(rhs)))
  }
}
