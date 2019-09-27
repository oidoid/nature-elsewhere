import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {EntityID} from './EntityID'
import {EntityType} from './EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {ImageStateMachine} from '../imageStateMachine/ImageStateMachine'
import {Layer} from '../image/Layer'
import {Rect} from '../math/Rect'
import {UpdatePredicate} from '../entities/updaters/updatePredicate/UpdatePredicate'
import {UpdaterMap} from '../entities/updaters/UpdaterMap'
import {UpdaterType} from '../entities/updaters/updaterType/UpdaterType'
import {UpdateState} from '../entities/updaters/UpdateState'
import {UpdateStatus} from '../entities/updaters/updateStatus/UpdateStatus'
import {DecamillipixelXY, FloatXY, XY} from '../math/XY'
import {EntityCollider} from '../collision/EntityCollider'
import {Level} from '../levels/Level'
import {CollisionType} from '../collision/CollisionType'

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
  readonly velocity: DecamillipixelXY
  readonly velocityFraction: FloatXY
  readonly machine: ImageStateMachine
  readonly updatePredicate: UpdatePredicate
  /** See UpdatePredicate. */
  readonly updaters: readonly UpdaterType[]
  readonly collisionPredicate: CollisionPredicate
  readonly collisionType: CollisionType
  /** Collision bodies in level coordinates. Check for bounds intersection
      before testing each body. Images should not be considered directly for
      collision tests. */
  readonly collisionBodies: readonly Rect[] // Move to CollisionBody with CollisionType prop
  /** Operations are shallow by default (do not recurse children) unless
      specified otherwise. That is, only translation and animation are
      recursive. */
  readonly children: Entity[]
}

export namespace Entity {
  export enum State {
    HIDDEN = 'hidden'
  }

  export function setImageID(entity: Entity, id: AtlasID): UpdateStatus {
    return ImageStateMachine.setImageID(entity.machine, id)
  }

  /** See Entity.spawnID. */
  export function equal(lhs: Entity, rhs: Entity): boolean {
    return lhs.spawnID === rhs.spawnID
  }

  /** This is a shallow invalidation. If a child changes state, or is added, the
          parents' bounds should be updated. */
  export function invalidateBounds(entity: Entity): void {
    const bounds = Rect.unionAll([
      imageRect(entity).bounds,
      ...entity.collisionBodies,
      ...entity.children.map(child => child.bounds)
    ])
    if (bounds) {
      entity.bounds.position.x = bounds.position.x
      entity.bounds.position.y = bounds.position.y
      entity.bounds.size.w = bounds.size.w
      entity.bounds.size.h = bounds.size.h
    }
  }

  export function moveTo(entity: Entity, to: Readonly<XY>): UpdateStatus {
    return moveBy(entity, to.sub(entity.bounds.position))
  }

  /** Recursively move the entity, its images, its collision bodies, and all of
          its children. */
  export function moveBy(entity: Entity, by: Readonly<XY>): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    if (!by.x && !by.y) return status
    entity.bounds.position.x += by.x
    entity.bounds.position.y += by.y
    status |= ImageRect.moveBy(imageRect(entity), by)
    Rect.moveAllBy(entity.collisionBodies, by)
    for (const child of entity.children) moveBy(child, by)
    return status | UpdateStatus.UPDATED
  }

  export function getScale(entity: Readonly<Entity>): XY {
    return imageRect(entity).scale
  }

  export function setScale(entity: Entity, scale: Readonly<XY>): UpdateStatus {
    const collisionScale =
      getScale(entity).x && getScale(entity).y
        ? scale.div(getScale(entity))
        : undefined
    const status = ImageRect.setScale(imageRect(entity), scale)
    if (collisionScale && status & UpdateStatus.UPDATED) {
      for (const body of entity.collisionBodies) {
        body.size.w *= Math.abs(collisionScale.x)
        body.size.h *= Math.abs(collisionScale.y)
      }
    }
    invalidateBounds(entity)
    return status
  }

  export function imageRect(entity: Readonly<Entity>): ImageRect {
    return ImageStateMachine.imageRect(entity.machine)
  }

  /** Recursively animate the entity and its children. Only visible entities are
      animated so its possible for a composition entity's children to be fully,
      *partly*, or not animated together. */
  export function animate(entity: Entity, state: UpdateState): Image[] {
    if (!Rect.intersects(state.level.cam.bounds, entity.bounds)) return []
    const visible = ImageRect.intersects(
      imageRect(entity),
      state.level.cam.bounds
    )
    for (const image of visible)
      Image.animate(image, state.time, state.level.atlas)
    return [
      ...visible,
      ...entity.children.reduce(
        (images: Image[], child) => [...images, ...animate(child, state)],
        []
      )
    ]
  }

  export function resetAnimation(entity: Entity): void {
    ImageStateMachine.resetAnimation(entity.machine)
  }

  /** Returns whether the current entity is in the viewport or should always be
      updated. Children are not considered. */
  export function active(entity: Readonly<Entity>, viewport: Rect): boolean {
    return (
      entity.updatePredicate === UpdatePredicate.ALWAYS ||
      Rect.intersects(entity.bounds, viewport)
    )
  }

  export function setState(
    entity: Entity,
    state: State | string
  ): UpdateStatus {
    const status = ImageStateMachine.setState(entity.machine, state)
    if (status & UpdateStatus.UPDATED) invalidateBounds(entity)
    return status
  }

  /** See UpdatePredicate. Actually this is going to go ahead and go into children so updte the docs */
  export function update(entity: Entity, state: UpdateState): UpdateStatus {
    if (!active(entity, state.level.cam.bounds)) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED
    for (const updater of entity.updaters) {
      status |= UpdaterMap[updater](entity, state)
      if (UpdateStatus.terminate(status)) return status
    }

    status |= updatePosition(entity, state)

    for (const child of entity.children) {
      status |= update(child, state)
      if (UpdateStatus.terminate(status)) return status
    }

    return status
  }

  export function findAnyByID(
    entities: readonly Entity[],
    id: EntityID
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = findByID(entity, id)
      if (found) return found
    }
    return
  }

  export function findAnyBySpawnID(
    entities: readonly Entity[],
    spawnID: Symbol
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = findBySpawnID(entity, spawnID)
      if (found) return found
    }
    return
  }

  export function findByID(entity: Entity, id: EntityID): Maybe<Entity> {
    return find(entity, entity => entity.id === id)
  }

  export function findBySpawnID(
    entity: Entity,
    spawnID: Symbol
  ): Maybe<Entity> {
    return find(entity, entity => entity.spawnID === spawnID)
  }

  export function find(
    entity: Entity,
    predicate: (entity: Entity) => boolean
  ): Maybe<Entity> {
    if (predicate(entity)) return entity
    for (const child of entity.children) {
      const descendant = find(child, predicate)
      if (descendant) return descendant
    }
    return
  }

  export function velocity(
    _entity: Entity,
    _time: Milliseconds,
    horizontal: boolean,
    vertical: boolean
  ): XY {
    const x = horizontal
      ? vertical
        ? 90
        : Math.sign(90) * Math.sqrt(90 * 90 + 90 * 90)
      : 0
    const y = vertical
      ? horizontal
        ? 90
        : Math.sign(90) * Math.sqrt(90 * 90 + 90 * 90)
      : 0
    return new XY(x, y)
  }

  /** Raise or lower an entity's images and its descendants' images for all
      states. */
  export function elevate(entity: Entity, offset: Layer): void {
    ImageStateMachine.elevate(entity.machine, offset)
    for (const child of entity.children) elevate(child, offset)
  }

  export function is<T extends Entity>(
    entity: Entity,
    type: T['type']
  ): entity is T {
    return entity.type === type
  }

  export function assert<T extends Entity>(
    entity: Entity,
    type: T['type']
  ): entity is T {
    const msg = `Unexpected entity type "${entity.type}". Expected "${type}".`
    if (!is(entity, type)) throw new Error(msg)
    return true
  }
}

function updatePosition(entity: Entity, state: UpdateState): UpdateStatus {
  // [todo] level bounds checking
  const from: Readonly<XY> = entity.bounds.position.copy()

  const diagonal = entity.velocity.x && entity.velocity.y

  entity.velocityFraction.x += entity.velocity.x * state.time
  entity.velocityFraction.y += entity.velocity.y * state.time

  if (diagonal) {
    // When moving diagonally, synchronize / group integer boundary changes
    // across directions to minimize pixel changes per frame and avoid jarring.
    const max = Math.max(
      Math.abs(entity.velocityFraction.x),
      Math.abs(entity.velocityFraction.y)
    )
    entity.velocityFraction.x = max * Math.sign(entity.velocity.x)
    entity.velocityFraction.y = max * Math.sign(entity.velocity.y)
  }

  const translate: Readonly<XY> = XY.trunc(
    entity.velocityFraction.x / 10_000,
    entity.velocityFraction.y / 10_000
  )
  entity.velocityFraction.x -= translate.x * 10_000
  entity.velocityFraction.y -= translate.y * 10_000

  const to: Readonly<XY> = entity.bounds.position.add(translate)
  let status = Entity.moveTo(entity, to)
  if (!(status & UpdateStatus.UPDATED)) return UpdateStatus.UNCHANGED

  const entities = Level.activeParentsWithPlayer(state.level)
  let collision = EntityCollider.collidesEntities(entity, entities)
  if (diagonal && collision) {
    status |= Entity.moveTo(entity, new XY(to.x, from.y))
    collision = EntityCollider.collidesEntities(entity, entities)
    if (collision) {
      status |= Entity.moveTo(entity, new XY(from.x, to.y))
      collision = EntityCollider.collidesEntities(entity, entities)
    }
  }

  if (collision) status |= Entity.moveTo(entity, new XY(from.x, from.y))

  return status
}
