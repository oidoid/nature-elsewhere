import {CollisionPredicate} from './CollisionPredicate'
import {Entity} from '../entity/Entity'
import {Rect, ReadonlyRect} from '../math/Rect'
import {ArrayUtil} from '../utils/ArrayUtil'

export namespace EntityCollider {
  export function collidesEntities(
    initiator: Entity,
    entities: readonly Entity[]
  ): readonly Entity[] {
    const collisions: Entity[] = []

    for (const entity of entities)
      collisions.push(...collidesEntity(initiator, entity))

    // Children are not shared so the collision array will not contain
    // duplicates.
    return collisions
  }

  export function collidesEntity(
    initiator: Entity,
    entity: Entity
  ): readonly Entity[] {
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
      return collidesRect(entity, initiator.bounds)

    // The initiator has body, image, or children collision.

    if (initiator.collisionPredicate === CollisionPredicate.BODIES) {
      // The initiator only has collision bodies. If the test entity or its
      // children collide with any of the initiator's bodies, a collision has
      // occurred. Otherwise, no collision has occurred.
      for (const body of initiator.collisionBodies)
        collisions.push(...collidesRect(entity, body))
      // Each body must be tested against the entity in case it has children so
      // that all collisions are reported. However, each collision should only
      // be reported once.
      return collisions.filter(ArrayUtil.unique((lhs, rhs) => lhs.equal(rhs)))
    }

    if (initiator.collisionPredicate === CollisionPredicate.IMAGES) {
      // The initiator only has image collision. If the test entity or its
      // children collide with any of the initiator's images, a collision has
      // occurred. Otherwise, no collision has occurred.
      if (!Rect.intersects(initiator.imageRect().bounds, entity.bounds))
        return collisions
      for (const image of initiator.imageRect().images)
        collisions.push(...collidesRect(entity, image.bounds))

      // Each image must be tested against the entity in case it has children so
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

  export function collidesRect(
    entity: Entity,
    rect: ReadonlyRect
  ): readonly Entity[] {
    const collisions: Entity[] = []
    if (entity.collisionPredicate === CollisionPredicate.NEVER)
      return collisions

    if (!Rect.intersects(entity.bounds, rect))
      // Any collisions requires the rectangle intersect with the entity's
      // bounds.
      return collisions

    if (entity.collisionPredicate === CollisionPredicate.BOUNDS) {
      // No further tests.
      collisions.push(entity)
      return collisions
    }

    if (entity.collisionPredicate === CollisionPredicate.BODIES) {
      // Test if any body collides.
      if (entity.collisionBodies.some(body => Rect.intersects(rect, body)))
        collisions.push(entity)
      return collisions
    }

    if (entity.collisionPredicate === CollisionPredicate.IMAGES) {
      // Test if any image collides.
      if (
        Rect.intersects(entity.imageRect().bounds, rect) &&
        entity
          .imageRect()
          .images.some(image => Rect.intersects(rect, image.bounds))
      )
        collisions.push(entity)
      return collisions
    }

    // Collision type is CollisionPredicate.CHILDREN.
    for (const child of entity.children)
      collisions.push(...collidesRect(child, rect))

    // Children are not shared so the collision array will not contain
    // duplicates.
    return collisions
  }
}
