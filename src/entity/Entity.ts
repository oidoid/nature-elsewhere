import {Assert} from '../utils/Assert'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {FloatXY, XY} from '../math/XY'
import {EntityCollider} from '../collision/EntityCollider'
import {EntityID} from './EntityID'
import {EntityType} from './EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {ImageStateMachine} from '../imageStateMachine/ImageStateMachine'
import {Layer} from '../image/Layer'
import {Level} from '../levels/Level'
import {Rect, ReadonlyRect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterMap} from '../updaters/UpdaterMap'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'

export class Entity<State extends string = string> {
  /** A globally unique identifier for quick equality checks. It should be used
      for no other purpose. The value is transient and should not be preserved
      on entity serialization. */
  private readonly _spawnID: symbol = Symbol()

  private readonly _id: EntityID

  private readonly _type: EntityType

  /** The local coordinate system or minimal union of the entity and all of its
      children given in level coordinates with origin at (x, y). All images,
      collisions, and children are always in bounds and are also specified in
      level coordinates, not coordinates relative the local entity origin. This
      local coordinate system is necessary for calculating absolute translations
      (moveTo), and quick cached collision and layout checks such as determining
      if the entity is on screen. All of these states must be kept in sync. */
  private readonly _bounds: Rect = Rect.make(0, 0, 0, 0)

  private readonly _velocity: XY

  private readonly _velocityFraction: FloatXY = {x: 0, y: 0}

  private readonly _machine: ImageStateMachine<State | Entity.BaseState>

  private readonly _updatePredicate: UpdatePredicate

  /** See UpdatePredicate. */
  private readonly _updaters: readonly UpdaterType[]

  private readonly _collisionType: CollisionType

  private _collisionPredicate: CollisionPredicate

  // how to handle collision mapping? by type? by mixin updater field thingy? how does this relate to existing collision checks such as those with cursor and button?
  /** Collision bodies in level coordinates. Check for bounds intersection
      before testing each body. Images should not be considered directly for
      collision tests. */
  private readonly _collisionBodies: readonly Rect[] // Move to CollisionBody with CollisionType prop

  /** Operations are shallow by default (do not recurse children) unless
      specified otherwise. That is, only translation and animation are
      recursive. */
  private readonly _children: Entity[]

  constructor(props: Entity.Props<State>) {
    this._id = props.id || EntityID.ANONYMOUS
    this._type = props.type
    this._velocity = props.velocity || new XY(0, 0)
    this._machine = new ImageStateMachine({state: props.state, map: props.map})
    this._updatePredicate =
      props.updatePredicate || UpdatePredicate.INTERSECTS_VIEWPORT
    this._updaters = props.updaters || []
    this._collisionType =
      props.collisionType === undefined
        ? CollisionType.INERT
        : props.collisionType
    this._collisionPredicate =
      props.collisionPredicate || CollisionPredicate.NEVER
    this._collisionBodies = props.collisionBodies || []
    this._children = props.children || []
    if (props.position) this.moveTo(props.position)
    if (props.scale) this.setScale(props.scale)
    this.setImageID(props.imageID)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children.
    this.invalidateBounds()
  }

  get spawnID(): symbol {
    return this._spawnID
  }

  get id(): EntityID {
    return this._id
  }

  get type(): EntityType {
    return this._type
  }
  get bounds(): ReadonlyRect {
    return this._bounds
  }

  get velocity(): XY {
    return this._velocity
  }

  get machine(): ImageStateMachine<State | Entity.BaseState> {
    return this._machine
  }

  get updatePredicate(): UpdatePredicate {
    return this._updatePredicate
  }

  get updaters(): readonly UpdaterType[] {
    return this._updaters
  }

  get collisionType(): CollisionType {
    return this._collisionType
  }

  get collisionPredicate(): CollisionPredicate {
    return this._collisionPredicate
  }

  set collisionPredicate(predicate: CollisionPredicate) {
    this._collisionPredicate = predicate
  }

  get collisionBodies(): readonly ReadonlyRect[] {
    return this._collisionBodies
  }

  get children(): readonly Entity[] {
    return this._children
  }

  setImageID(id?: AtlasID): UpdateStatus {
    return this.machine.setImageID(id)
  }

  /** See Entity.spawnID. */
  equal(entity: Entity): boolean {
    return this.spawnID === entity.spawnID
  }

  addImages(...images: readonly Image[]): void {
    this.machine.addImages(...images)
    this.invalidateBounds()
  }

  getImageBounds(): ReadonlyRect {
    return this.machine.bounds()
  }

  /** This is a shallow invalidation. If a child changes state, or is added, the
      parents' bounds should be updated. */
  invalidateBounds(): void {
    const bounds = Rect.unionAll([
      this.machine.bounds(),
      ...this.collisionBodies,
      ...this.children.map(child => child.bounds)
    ])
    if (bounds) {
      this._bounds.position.x = bounds.position.x
      this._bounds.position.y = bounds.position.y
      this._bounds.size.w = bounds.size.w
      this._bounds.size.h = bounds.size.h
    }
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this.moveBy(to.sub(this.bounds.position))
  }

  /** Recursively move the entity, its images, its collision bodies, and all of
      its children. */
  moveBy(by: Readonly<XY>): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    if (!by.x && !by.y) return status
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
    status |= this.machine.moveBy(by)
    Rect.moveAllBy(this._collisionBodies, by)
    for (const child of this.children) child.moveBy(by)
    return status | UpdateStatus.UPDATED
  }

  getScale(): Readonly<XY> {
    return this.machine.getScale()
  }

  setScale(scale: Readonly<XY>): UpdateStatus {
    const collisionScale =
      this.getScale().x && this.getScale().y
        ? scale.div(this.getScale())
        : undefined
    const status = this.machine.scaleTo(scale)
    if (collisionScale && status & UpdateStatus.UPDATED) {
      for (const body of this._collisionBodies) {
        body.size.w *= Math.abs(collisionScale.x)
        body.size.h *= Math.abs(collisionScale.y)
      }
    }
    this.invalidateBounds()
    return status
  }

  addChildren(...children: readonly Entity[]): void {
    this._children.push(...children)
    this.invalidateBounds()
  }

  removeChild(child: Readonly<Entity>): void {
    const index = this.children.findIndex(entity => child.equal(entity))
    if (index === -1) return
    this._children.splice(index, 1)
    this.invalidateBounds()
  }

  getImageID(): Maybe<AtlasID> {
    return this.machine.getImageID()
  }

  getImages(): readonly Readonly<Image>[] {
    return this.machine.images()
  }

  getOrigin(): Readonly<XY> {
    return this.machine.origin()
  }

  /** Recursively animate the entity and its children. Only visible entities are
      animated so its possible for a composition entity's children to be fully,
      *partly*, or not animated together. */
  animate(state: UpdateState): Readonly<Image>[] {
    if (!Rect.intersects(state.level.cam.bounds, this.bounds)) return []
    const visible = this.machine.intersects(state.level.cam.bounds)
    for (const image of visible) image.animate(state.time, state.level.atlas)
    for (const child of this.children) visible.push(...child.animate(state))
    return visible
  }

  resetAnimation(): void {
    this.machine.resetAnimation()
  }

  /** Returns whether the current entity is in the viewport or should always be
      updated. Children are not considered. */
  active(viewport: ReadonlyRect): boolean {
    return (
      this.updatePredicate === UpdatePredicate.ALWAYS ||
      Rect.intersects(this.bounds, viewport)
    )
  }

  getState(): State | Entity.BaseState {
    return this.machine.state
  }

  setState(state: State | Entity.BaseState): UpdateStatus {
    const status = this.machine.setState(state)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  /** See UpdatePredicate. Actually this is going to go ahead and go into children so updte the docs */
  update(state: UpdateState, skipChildren = false): UpdateStatus {
    if (!this.active(state.level.cam.bounds)) return UpdateStatus.UNCHANGED

    let status = UpdateStatus.UNCHANGED
    for (const updater of this.updaters) {
      status |= UpdaterMap[updater](this, state)
      if (UpdateStatus.terminate(status)) return status
    }

    status |= this._updatePosition(state)

    if (skipChildren) return status

    for (const child of this.children) {
      status |= child.update(state)
      if (UpdateStatus.terminate(status)) return status
    }

    return status
  }

  static findAnyByID(entities: readonly Entity[], id: EntityID): Maybe<Entity> {
    for (const entity of entities) {
      const found = entity.findByID(id)
      if (found) return found
    }
    return
  }

  static findAnyBySpawnID(
    entities: readonly Entity[],
    spawnID: Symbol
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = entity.findBySpawnID(spawnID)
      if (found) return found
    }
    return
  }

  findByID(id: EntityID): Maybe<Entity> {
    return this.find(entity => entity.id === id)
  }

  findBySpawnID(spawnID: Symbol): Maybe<Entity> {
    return this.find(entity => entity.spawnID === spawnID)
  }

  find(predicate: (entity: Entity) => boolean): Maybe<Entity> {
    if (predicate(this)) return this
    for (const child of this.children) {
      const descendant = child.find(predicate)
      if (descendant) return descendant
    }
    return
  }

  /** Raise or lower an entity's images and its descendants' images for all
      states. */
  elevate(offset: Layer): void {
    this.machine.elevate(offset)
    for (const child of this.children) child.elevate(offset)
  }

  is<T extends Entity>(type: T['type']): this is T {
    return this.type === type
  }

  assert<T extends Entity>(type: T['type']): this is T {
    const msg = `Unexpected entity type "${this.type}". Expected "${type}".`
    Assert.assert(this.is(type), msg)
    return true
  }

  private _updatePosition(state: UpdateState): UpdateStatus {
    // [todo] level bounds checking
    const from: Readonly<XY> = this.bounds.position.copy()

    const diagonal = this.velocity.x && this.velocity.y

    this._velocityFraction.x += this.velocity.x * state.time
    this._velocityFraction.y += this.velocity.y * state.time

    if (diagonal) {
      // When moving diagonally, synchronize / group integer boundary changes
      // across directions to minimize pixel changes per frame and avoid jarring.
      const max = Math.max(
        Math.abs(this._velocityFraction.x),
        Math.abs(this._velocityFraction.y)
      )
      this._velocityFraction.x = max * Math.sign(this.velocity.x)
      this._velocityFraction.y = max * Math.sign(this.velocity.y)
    }

    const translate: Readonly<XY> = XY.trunc(
      this._velocityFraction.x / 10_000,
      this._velocityFraction.y / 10_000
    )
    this._velocityFraction.x -= translate.x * 10_000
    this._velocityFraction.y -= translate.y * 10_000

    const to: Readonly<XY> = this.bounds.position.add(translate)
    let status = this.moveTo(to)
    if (!(status & UpdateStatus.UPDATED)) return UpdateStatus.UNCHANGED

    const entities = Level.activeParentsWithPlayer(state.level)

    let collidesWith = EntityCollider.collidesEntities(this, entities)
    if (
      !collidesWith.some(
        collision => collision.collisionType & CollisionType.OBSTACLE
      )
    )
      return status

    if (diagonal && collidesWith.length) {
      status |= this.moveTo(new XY(to.x, from.y))
      collidesWith = EntityCollider.collidesEntities(this, entities)
      if (collidesWith.length) {
        status |= this.moveTo(new XY(from.x, to.y))
        collidesWith = EntityCollider.collidesEntities(this, entities)
      }
    }

    if (collidesWith.length) status |= this.moveTo(new XY(from.x, from.y))

    return status
  }
}

export namespace Entity {
  export enum BaseState {
    HIDDEN = 'hidden'
  }

  export interface Props<State extends string = string> {
    /** Defaults to EntityID.UNDEFINED. */
    readonly id?: EntityID
    readonly type: EntityType
    /** Defaults to (0, 0). */
    readonly position?: XY
    readonly scale?: XY
    readonly imageID?: AtlasID
    readonly velocity?: XY
    /** Defaults to {}. */
    readonly state: State | BaseState
    readonly map: Record<State | BaseState, ImageRect>
    /** Defaults to BehaviorPredicate.NEVER. */
    readonly updatePredicate?: UpdatePredicate
    /** Defaults to []. */
    readonly updaters?: UpdaterType[]
    /** Defaults to CollisionPredicate.NEVER. */
    readonly collisionType?: CollisionType
    readonly collisionPredicate?: CollisionPredicate
    /** Defaults to []. In local coordinates (converted to level by parser). */
    readonly collisionBodies?: Rect[]
    /** Defaults to []. */
    readonly children?: Entity[]
  }
  export interface SubProps<State extends string = string>
    extends Optional<
      Entity.Props<State>,
      | 'type'
      | 'state'
      | 'map'
      | 'updatePredicate'
      | 'updaters'
      | 'collisionType'
      | 'collisionPredicate'
      | 'collisionBodies'
    > {}
}
