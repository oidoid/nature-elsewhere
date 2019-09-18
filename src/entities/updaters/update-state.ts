import {Entity} from '../entity'
import {Level} from '../../levels/level'
import {Recorder} from '../../inputs/recorder'
import {EntityCollision} from '../../collision/entity-collision'
import {EntityCollider} from '../../collision/entity-collider'

/** Game tick state to be applied. Cached values for commonly derived values are
    also included for convenience. */
export interface UpdateState {
  /** The duration of time to update state for. */
  readonly time: Milliseconds
  /** A shallow subset of Level.parentEntities. Children should only be mutated
      through these parents. Parents should only interact with each other, never
      with each other's children. The children may or may not be active. Cursor
      and player entities are accessed through Level and never present in
      activeParents. */
  readonly activeParents: Entity[]
  /** If present, the LHS is Level.cursor. */
  readonly collisionWithCursor: Maybe<EntityCollision>
  readonly level: Level
  readonly input: Recorder
}

export namespace UpdateState {
  export function make(
    time: Milliseconds,
    level: Level,
    input: Recorder
  ): UpdateState {
    const activeParents = level.parentEntities.filter(entity =>
      Entity.active(entity, level.cam.bounds)
    )
    const collisionWithCursor = level.cursor
      ? EntityCollider.collidesEntities(level.cursor, activeParents)
      : undefined
    return {time, activeParents, collisionWithCursor, level, input}
  }

  export function collisionWithCursor(
    state: UpdateState,
    entity: Entity
  ): Maybe<EntityCollision> {
    if (!state.collisionWithCursor) return
    if (Entity.equal(state.collisionWithCursor.rhs.descendant, entity))
      return state.collisionWithCursor
    return
  }
}
