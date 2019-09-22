import {Entity} from './Entity'
import {EntityID} from '../entityID/EntityID'
import {EntityState} from '../entityState/EntityState'
import {Image} from '../../images/image/Image'
import {ImageRect} from '../../images/imageRect/ImageRect'
import {Rect} from '../../math/rect/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../../math/xy/XY'
import {UpdateState} from '../updaters/UpdateState'
import {UpdaterMap} from '../updaters/UpdaterMap'
import {Layer} from '../../images/layer/layer'

export namespace EntityUtil {
  /** See Entity.spawnID. */
  export function equal(lhs: Entity, rhs: Entity): boolean {
    return lhs.spawnID === rhs.spawnID
  }

  /** This is a shallow invalidation. If a child changes state, or is added, the
      parents' bounds should be updated. */
  export function invalidateBounds(entity: Entity): void {
    const bounds = Rect.unionAll([
      imageState(entity).bounds,
      ...entity.collisionBodies,
      ...entity.children.map(child => child.bounds)
    ])
    if (bounds) {
      entity.bounds.x = bounds.x
      entity.bounds.y = bounds.y
      entity.bounds.w = bounds.w
      entity.bounds.h = bounds.h
    }
  }

  export function moveTo(entity: Entity, to: XY): UpdateStatus {
    return moveBy(entity, XY.sub(to, entity.bounds))
  }

  /** Recursively move the entity, its images, its collision bodies, and all of
      its children. */
  export function moveBy(entity: Entity, by: XY): UpdateStatus {
    if (!by.x && !by.y) return UpdateStatus.UNCHANGED
    entity.bounds.x += by.x
    entity.bounds.y += by.y
    ImageRect.moveBy(imageState(entity), by)
    Rect.moveAllBy(entity.collisionBodies, by)
    entity.children.forEach(child => moveBy(child, by))
    return UpdateStatus.UPDATED
  }

  export function setScale(entity: Entity, scale: XY): void {
    ImageRect.setScale(imageState(entity), scale)
  }

  export function getScale(entity: Readonly<Entity>): XY {
    return imageState(entity).scale
  }

  export function imageState(entity: Readonly<Entity>): ImageRect {
    return entity.imageStates[entity.state]
  }

  /** Recursively animate the entity and its children. Only visible entities are
      animated so its possible for a composition entity's children to be fully,
      *partly*, or not animated together. */
  export function animate(entity: Entity, state: UpdateState): Image[] {
    if (!Rect.intersects(state.level.cam.bounds, entity.bounds)) return []
    const visible = ImageRect.intersects(
      imageState(entity),
      state.level.cam.bounds
    )
    visible.forEach(image =>
      Image.animate(image, state.time, state.level.atlas)
    )
    return [
      ...visible,
      ...entity.children.reduce(
        (images: Image[], child) => [...images, ...animate(child, state)],
        []
      )
    ]
  }

  export function resetAnimation(entity: Entity): void {
    imageState(entity).images.forEach(({animator}) => {
      animator.period = 0
      animator.exposure = 0
    })
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
    state: EntityState | string
  ): UpdateStatus {
    if (entity.state === state) return UpdateStatus.UNCHANGED
    const {bounds, scale} = imageState(entity)
    entity.state = state
    ImageRect.moveTo(imageState(entity), bounds)
    setScale(entity, scale)
    invalidateBounds(entity)
    return UpdateStatus.UPDATED
  }

  /** See UpdatePredicate. Actually this is going to go ahead and go into children so updte the docs */
  export function update(entity: Entity, state: UpdateState): UpdateStatus {
    if (!active(entity, state.level.cam.bounds)) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED
    for (const updater of entity.updaters) {
      status |= UpdaterMap[updater](entity, state)
      if (UpdateStatus.terminate(status)) return status
    }

    for (const child of entity.children) {
      status |= update(child, state)
      if (UpdateStatus.terminate(status)) return status
    }

    return status
  }

  export function findAny(
    entities: readonly Entity[],
    id: EntityID
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = find(entity, id)
      if (found) return found
    }
    return
  }

  export function find(entity: Entity, id: EntityID): Maybe<Entity> {
    if (entity.id === id) return entity
    for (const child of entity.children) {
      const descendant = find(child, id)
      if (descendant) return descendant
    }
    return
  }

  export function velocity(
    _entity: Entity,
    time: Milliseconds,
    horizontal: boolean,
    vertical: boolean
  ): XY {
    const vx = 90
    const vy = 90
    const x = horizontal
      ? vertical
        ? vx
        : Math.sign(vx) * Math.sqrt(vx * vx + vy * vy)
      : 0
    const y = vertical
      ? horizontal
        ? vy
        : Math.sign(vy) * Math.sqrt(vx * vx + vy * vy)
      : 0
    return {x: (x * time) / 10000, y: (y * time) / 10000}
  }

  /** Raise or lower an entity's images and its descendants' images. */
  export function elevate(entity: Entity, offset: Layer): void {
    for (const state in entity.imageStates)
      ImageRect.elevate(entity.imageStates[state], offset)
    for (const child of entity.children) elevate(child, offset)
  }
}
