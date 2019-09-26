import {Entity} from '../entity/Entity'

export interface EntityCollision {
  // type: CollisionType
  readonly lhs: ParentDescendant
  readonly rhs: ParentDescendant
}

export interface ParentDescendant {
  readonly parent?: Entity
  readonly descendant: Entity
}
