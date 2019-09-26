import {CollisionPredicate} from './CollisionPredicate'
import {EntityCollision, ParentDescendant} from './EntityCollision'
import {Entity} from '../entity/Entity'
import {Rect} from '../math/Rect'

export namespace EntityCollider {
  export function collidesEntities(
    lhs: Readonly<Entity>,
    entities: readonly Readonly<Entity>[]
  ): Maybe<EntityCollision> {
    for (const rhs of entities) {
      const collision = collidesEntity(lhs, rhs)
      if (collision) return collision
    }
    return
  }

  export function collidesEntity(
    lhs: Readonly<Entity>,
    rhs: Readonly<Entity>
  ): Maybe<EntityCollision> {
    if (
      lhs.collisionPredicate === CollisionPredicate.NEVER ||
      rhs.collisionPredicate === CollisionPredicate.NEVER
    )
      // One or both of the entities have no collision.
      return

    // Both of the entities have collision.

    if (!Rect.intersects(lhs.bounds, rhs.bounds))
      // Any collision requires both entities to intersect.
      return

    // The entities intersect.

    if (rhs.collisionPredicate === CollisionPredicate.BOUNDS) {
      // The RHS entity only has bounding rectangle collision. If the LHS or
      // its children collide with the RHS's bounds, a collision has occurred.
      const collision = collidesRect(lhs, rhs.bounds)
      if (collision)
        return {
          lhs: {
            parent: Entity.equal(lhs, collision.descendant) ? undefined : lhs,
            descendant: collision.descendant
          },
          rhs: {descendant: rhs}
        }
      // Otherwise, no collision has occurred.
      return
    }

    // The RHS entity has body, image, or children collision.

    if (rhs.collisionPredicate === CollisionPredicate.BODIES) {
      // The RHS entity only has collision bodies. If the LHS or its children
      // collide with any of the RHS's bodies, a collision has occurred.
      // Otherwise, no collision has occurred.
      for (const body of rhs.collisionBodies) {
        const collision = collidesRect(lhs, body)
        if (collision)
          return {
            lhs: {
              parent: Entity.equal(lhs, collision.descendant) ? undefined : lhs,
              descendant: collision.descendant
            },
            rhs: {descendant: rhs}
          }
      }
      return
    }

    if (rhs.collisionPredicate === CollisionPredicate.IMAGES) {
      // The RHS entity only has image collision. If the LHS or its children
      // collide with any of the RHS's images, a collision has occurred.
      // Otherwise, no collision has occurred.
      for (const image of Entity.imageRect(rhs).images) {
        const collision = collidesRect(lhs, image.bounds)
        if (collision)
          return {
            lhs: {
              parent: Entity.equal(lhs, collision.descendant) ? undefined : lhs,
              descendant: collision.descendant
            },
            rhs: {descendant: rhs}
          }
      }
      return
    }

    // The other entity has CollisionPredicate.CHILDREN.
    for (const child of rhs.children) {
      const collision = collidesEntity(lhs, child)
      if (collision)
        return {
          lhs: collision.lhs,
          rhs: {
            parent: Entity.equal(rhs, collision.rhs.descendant)
              ? undefined
              : rhs,
            descendant: collision.rhs.descendant
          }
        }
    }

    return
  }

  export function collidesRect(
    entity: Readonly<Entity>,
    rect: Rect
  ): Maybe<ParentDescendant> {
    if (entity.collisionPredicate === CollisionPredicate.NEVER) return

    if (!Rect.intersects(entity.bounds, rect))
      // Any collisions requires the rectangle intersect with the entity's
      // bounds.
      return

    if (entity.collisionPredicate === CollisionPredicate.BOUNDS)
      // No further tests.
      return {descendant: entity}

    if (entity.collisionPredicate === CollisionPredicate.BODIES) {
      // Test if any body collides.
      if (entity.collisionBodies.some(body => Rect.intersects(rect, body)))
        return {descendant: entity}
      return
    }

    if (entity.collisionPredicate === CollisionPredicate.IMAGES) {
      // Test if any image collides.
      if (
        Entity.imageRect(entity).images.some(image =>
          Rect.intersects(rect, image.bounds)
        )
      )
        return {descendant: entity}
      return
    }

    // Collision type is CollisionPredicate.CHILDREN.
    for (const child of entity.children) {
      const collision = collidesRect(child, rect)
      if (collision) return {parent: entity, descendant: collision.descendant}
    }
    return
  }
}
