import {CollisionPredicate} from './CollisionPredicate'
import {Entity} from '../entity/Entity'
import {Rect} from '../math/Rect'

export interface EntityCollision {
  readonly initiator: CollisionParty
  readonly collidesWith: CollisionParty
}

export interface CollisionParty {
  /** One of the two entities involved in the collision. */
  readonly party: Entity
  /** The topmost parent the collision was detected through. The parent is never
      the party. */
  readonly parent?: Entity
}

export namespace EntityCollider {
  export function collidesEntities(
    initiator: Readonly<Entity>,
    entities: readonly Readonly<Entity>[]
  ): Maybe<EntityCollision> {
    for (const entity of entities) {
      const collision = collidesEntity(initiator, entity)
      if (collision) return collision
    }
    return
  }

  export function collidesEntity(
    initiator: Readonly<Entity>,
    entity: Readonly<Entity>
  ): Maybe<EntityCollision> {
    if (
      initiator.collisionPredicate === CollisionPredicate.NEVER ||
      entity.collisionPredicate === CollisionPredicate.NEVER ||
      Entity.equal(initiator, entity)
    )
      // One or both of the entities have no collision or are identical.
      return

    // Both of the entities have collision.

    if (!Rect.intersects(initiator.bounds, entity.bounds))
      // Any collision requires both entities to intersect.
      return

    // The entities intersect.

    if (entity.collisionPredicate === CollisionPredicate.BOUNDS) {
      // The test entity only has bounding rectangle collision. If the initiator
      // or its children collide with the test entity's bounds, a collision has
      // occurred.
      const collision = collidesRect(initiator, entity.bounds)
      if (collision)
        return {
          initiator: {
            parent: Entity.equal(initiator, collision.party)
              ? undefined
              : initiator,
            party: collision.party
          },
          collidesWith: {party: entity}
        }
      // Otherwise, no collision has occurred.
      return
    }

    // The test entity has body, image, or children collision.

    if (entity.collisionPredicate === CollisionPredicate.BODIES) {
      // The test entity only has collision bodies. If the initiator or its
      // children collide with any of the test entity's bodies, a collision has
      // occurred. Otherwise, no collision has occurred.
      for (const body of entity.collisionBodies) {
        const collision = collidesRect(initiator, body)
        if (collision)
          return {
            initiator: {
              parent: Entity.equal(initiator, collision.party)
                ? undefined
                : initiator,
              party: collision.party
            },
            collidesWith: {party: entity}
          }
      }
      return
    }

    if (entity.collisionPredicate === CollisionPredicate.IMAGES) {
      // The test entity only has image collision. If the initiator or its
      // children collide with any of the test's images, a collision has
      // occurred. Otherwise, no collision has occurred.
      for (const image of Entity.imageRect(entity).images) {
        const collision = collidesRect(initiator, image.bounds)
        if (collision)
          return {
            initiator: {
              parent: Entity.equal(initiator, collision.party)
                ? undefined
                : initiator,
              party: collision.party
            },
            collidesWith: {party: entity}
          }
      }
      return
    }

    // The other entity has CollisionPredicate.CHILDREN.
    for (const child of entity.children) {
      const collision = collidesEntity(initiator, child)
      if (collision)
        return {
          initiator: collision.initiator,
          collidesWith: {
            parent: Entity.equal(entity, collision.collidesWith.party)
              ? undefined
              : entity,
            party: collision.collidesWith.party
          }
        }
    }

    return
  }

  export function collidesRect(
    entity: Readonly<Entity>,
    rect: Rect
  ): Maybe<CollisionParty> {
    if (entity.collisionPredicate === CollisionPredicate.NEVER) return

    if (!Rect.intersects(entity.bounds, rect))
      // Any collisions requires the rectangle intersect with the entity's
      // bounds.
      return

    if (entity.collisionPredicate === CollisionPredicate.BOUNDS)
      // No further tests.
      return {party: entity}

    if (entity.collisionPredicate === CollisionPredicate.BODIES) {
      // Test if any body collides.
      if (entity.collisionBodies.some(body => Rect.intersects(rect, body)))
        return {party: entity}
      return
    }

    if (entity.collisionPredicate === CollisionPredicate.IMAGES) {
      // Test if any image collides.
      if (
        Entity.imageRect(entity).images.some(image =>
          Rect.intersects(rect, image.bounds)
        )
      )
        return {party: entity}
      return
    }

    // Collision type is CollisionPredicate.CHILDREN.
    for (const child of entity.children) {
      const collision = collidesRect(child, rect)
      if (collision) return {parent: entity, party: collision.party}
    }
    return
  }
}
