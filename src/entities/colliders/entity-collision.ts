import {Entity} from '../entity'

export interface EntityCollision {
  readonly lhs: ParentDescendant
  readonly rhs: ParentDescendant
}

export interface ParentDescendant {
  readonly parent?: Entity
  readonly descendant: Entity
}
