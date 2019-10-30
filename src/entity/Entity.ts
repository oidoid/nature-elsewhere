import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {EntityCollider} from '../collision/EntityCollider'
import {EntityConfig} from './EntityConfig'
import {EntityID} from './EntityID'
import {EntityType} from './EntityType'
import {FloatXY} from '../math/FloatXY'
import {Integer} from 'aseprite-atlas'
import {Layer} from '../sprite/Layer'
import {Level} from '../levels/Level'
import {ProcessChildren} from './ProcessChildren'
import {ReadonlyRect, Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {SpriteStateMachine} from '../spriteStateMachine/SpriteStateMachine'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {XY} from '../math/XY'

export abstract class Entity<
  Variant extends string = string,
  State extends string = string
> {
  private readonly _id: EntityID

  /** Type is used by the EntitySerializer and EntityParser to identify the
      appropriate Entity subclass constructor. */
  private readonly _type: EntityType
  /** Variants allow multiple forms of the same type. For example, two different
      representations of an apple tree. All variants must support all states.
      States are expected to change during execution but variants generally do
      not. */
  private readonly _variant: Variant

  /** The local coordinate system or minimal union of the entity and all of its
      children given in level coordinates with origin at (x, y). All sprites,
      collisions, and children are always in bounds and are also specified in
      level coordinates, not coordinates relative the local entity origin. This
      local coordinate system is necessary for calculating absolute translations
      (moveTo), and quick cached collision and layout checks such as determining
      if the entity is on screen. All of these states must be kept in sync. */
  protected readonly _bounds: Rect

  private readonly _velocity: XY
  private readonly _velocityFraction: FloatXY

  private readonly _machine: SpriteStateMachine<State>

  private readonly _updatePredicate: UpdatePredicate

  private _collisionType: CollisionType
  private _collisionPredicate: CollisionPredicate
  /** Collision bodies in level coordinates. Check for bounds intersection
      before testing each body. Sprites should not be considered directly for
      collision tests. */
  private readonly _collisionBodies: readonly Rect[]

  /** Operations are shallow by default (do not recurse children) unless
      specified otherwise. That is, only translation and animation are
      recursive. */
  private readonly _children: Entity[]

  constructor(props: Entity.Props<Variant, State>) {
    this._id = props.id ?? Entity.defaults.id
    this._type = props.type
    this._variant = props.variant
    this._bounds = Rect.make(0, 0, 0, 0)
    this._velocity =
      props.velocity ??
      (props.vx !== undefined || props.vy !== undefined
        ? new XY(props.vx ?? 0, props.vy ?? 0)
        : Entity.defaults.velocity.copy())
    this._velocityFraction = {x: 0, y: 0}
    this._machine = new SpriteStateMachine({state: props.state, map: props.map})
    this._updatePredicate =
      props.updatePredicate ?? Entity.defaults.updatePredicate
    this._collisionType = props.collisionType ?? Entity.defaults.collisionType
    this._collisionPredicate =
      props.collisionPredicate ?? Entity.defaults.collisionPredicate
    this._collisionBodies = props.collisionBodies ?? [
      ...Entity.defaults.collisionBodies
    ]
    this._children = props.children ?? []
    this.setConstituentID(props.constituentID)

    if (props.elevation) this.elevateTo(props.elevation)

    // Calculate the bounds of the entity's sprites, collision bodies, and all
    // children. Children themselves are not invalidated by this call.
    this.invalidateBounds()

    const position =
      props.position ??
      (props.x !== undefined || props.y !== undefined
        ? new XY(props.x ?? 0, props.y ?? 0)
        : undefined)
    if (position !== undefined) this.moveTo(position)
    const scale =
      props.scale ??
      (props.sx !== undefined || props.sy !== undefined
        ? new XY(props.sx ?? 1, props.sy ?? 1)
        : undefined)
    if (scale !== undefined) this.scaleTo(scale)

    // EntityParser doesn't have access to the array of variants.
    if (!this.variants.includes(props.variant))
      throw new Error(`Unknown variant "${props.variant}".`)
  }
  get id(): EntityID {
    return this._id
  }

  get type(): EntityType {
    return this._type
  }

  get variant(): Variant {
    return this._variant
  }

  get variants(): Variant[] {
    if ('Variant' in this.constructor)
      return Object.values(this.constructor['Variant'])
    return [this.variant]
  }

  get bounds(): ReadonlyRect {
    return this._bounds
  }

  /** See SpriteRect._origin. */
  get origin(): Readonly<XY> {
    return this._machine.origin
  }

  set origin(origin: Readonly<XY>) {
    this._machine.origin = origin
  }

  /** The bounds of all the sprites only (children and collision rectangles are
      not considered). */
  get spriteBounds(): ReadonlyRect {
    return this._machine.bounds
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this.moveBy(to.sub(this.origin))
  }

  moveBoundsTo(to: Readonly<XY>): UpdateStatus {
    return this.moveBy(to.sub(this.bounds.position))
  }

  /** Recursively move the entity, its sprites, its collision bodies, and all of
      its children. */
  moveBy(by: Readonly<XY>): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    if (!by.x && !by.y) return status
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
    status |= this._machine.moveBy(by)
    Rect.moveAllBy(this._collisionBodies, by)
    for (const child of this.children) status |= child.moveBy(by)
    return status | UpdateStatus.UPDATED
  }

  /** This is a shallow invalidation. If a child changes state, or is added, the
      parents' bounds should be updated. */
  invalidateBounds(): void {
    const bounds = Rect.unionAll([
      this.spriteBounds,
      ...this.collisionBodies,
      ...this.children.map(child => child.bounds)
    ])
    if (!bounds) return
    this._bounds.position.x = bounds.position.x
    this._bounds.position.y = bounds.position.y
    this._bounds.size.w = bounds.size.w
    this._bounds.size.h = bounds.size.h
  }

  get scale(): Readonly<XY> {
    return this._machine.scale
  }

  scaleTo(to: Readonly<XY>): UpdateStatus {
    return this.scaleBy(to.div(this.scale))
  }

  scaleBy(by: Readonly<XY>): UpdateStatus {
    if (by.x === 1 && by.y === 1) return UpdateStatus.UNCHANGED
    Sprite.validateScale(by)
    const status = this._machine.scaleBy(by)
    if (status & UpdateStatus.UPDATED)
      for (const body of this._collisionBodies) {
        body.size.w *= Math.abs(by.x)
        body.size.h *= Math.abs(by.y)
      }
    this.invalidateBounds()
    return status
  }

  get constituentID(): Maybe<AtlasID> {
    return this._machine.constituentID
  }

  setConstituentID(id?: AtlasID): UpdateStatus {
    return this._machine.setConstituentID(id)
  }

  get elevation(): Layer {
    return this._machine.elevation
  }

  elevateTo(to: Layer): UpdateStatus {
    return this.elevateBy(to - this.elevation)
  }

  /** Raise or lower an entity's sprites and its descendants' sprites for all
      states. */
  elevateBy(by: Layer): UpdateStatus {
    if (!by) return UpdateStatus.UNCHANGED
    const status = this._machine.elevateBy(by)
    if (status & UpdateStatus.UPDATED)
      for (const child of this.children) child.elevateBy(by)
    return status
  }

  get velocity(): XY {
    return this._velocity
  }

  get updatePredicate(): UpdatePredicate {
    return this._updatePredicate
  }

  get collisionType(): CollisionType {
    return this._collisionType
  }

  set collisionType(type: CollisionType) {
    this._collisionType = type
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

  find(predicate: (entity: Entity) => boolean): Maybe<Entity> {
    if (predicate(this)) return this
    for (const child of this.children) {
      const descendant = child.find(predicate)
      if (descendant) return descendant
    }
    return
  }

  findByID(id: EntityID): Maybe<Entity> {
    return this.find(entity => entity.id === id)
  }

  descends(entity: Readonly<Entity>): boolean {
    return (
      this === entity || this.children.some(child => child.descends(entity))
    )
  }

  addChildren(...entities: readonly Entity[]): void {
    this._children.push(...entities)
    this.invalidateBounds()
  }

  removeChild(child: Readonly<Entity>): boolean {
    const index = this.children.findIndex(entity => child === entity)
    if (index > -1) this._children.splice(index, 1)
    if (
      index !== -1 ||
      this.children.some(parent => parent.removeChild(child))
    ) {
      this.invalidateBounds()
      return true
    }
    return false
  }

  clearChildren(): void {
    this._children.length = 0
    this.invalidateBounds()
  }

  replaceChild(from: Readonly<Entity>, to: Entity): boolean {
    const index = this.children.findIndex(entity => from === entity)
    if (index > -1) this._children[index] = to
    if (
      index !== -1 ||
      this.children.some(parent => parent.replaceChild(from, to))
    ) {
      this.invalidateBounds()
      return true
    }
    return false
  }

  get state(): State {
    return this._machine.state
  }

  get states(): State[] {
    return this._machine.states
  }

  transition(state: State): UpdateStatus {
    const status = this._machine.transition(state)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  get sprites(): readonly Readonly<Sprite>[] {
    return this._machine.sprites
  }

  addSprites(...sprites: readonly Sprite[]): void {
    this._machine.addSprites(...sprites)
    this.invalidateBounds()
  }

  replaceSprites(state: State, ...sprites: readonly Sprite[]): void {
    this._machine.replaceSprites(state, ...sprites)
    this.invalidateBounds()
  }

  moveSpritesTo(to: Readonly<XY>): UpdateStatus {
    const status = this._machine.moveTo(to)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  moveSpritesBy(by: Readonly<XY>): UpdateStatus {
    const status = this._machine.moveBy(by)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  invalidateSpriteBounds(): void {
    this._machine.invalidate()
    this.invalidateBounds()
  }

  /** See UpdatePredicate. Actually this is going to go ahead and go into children so updte the docs */
  update(
    state: UpdateState,
    processChildren: ProcessChildren = ProcessChildren.INCLUDE
  ): UpdateStatus {
    if (!this.active(state.level.cam.bounds)) return UpdateStatus.UNCHANGED

    let status = this._updatePositionForVelocity(state)

    if (processChildren === ProcessChildren.SKIP) return status

    for (const child of this.children) {
      status |= child.update(state)
      if (UpdateStatus.terminate(status)) return status
    }

    return status
  }

  /** Returns whether the current entity is in the viewport or should always be
      updated. Children are not considered. */
  active(viewport: ReadonlyRect): boolean {
    return (
      this.updatePredicate === UpdatePredicate.ALWAYS ||
      Rect.intersects(this.bounds, viewport)
    )
  }

  /** Recursively animate the entity and its children. Only visible entities are
      animated so its possible for a composition entity's children to be fully,
      *partly*, or not animated together. */
  animate(state: UpdateState): Readonly<Sprite>[] {
    if (!Rect.intersects(state.level.cam.bounds, this.bounds)) return []
    const visible = this._machine.intersects(state.level.cam.bounds)
    for (const sprite of visible) sprite.animate(state.level.atlas, state.time)
    for (const child of this.children) visible.push(...child.animate(state))
    return visible
  }

  resetAnimation(): void {
    this._machine.resetAnimation()
  }

  collidesRect(rect: ReadonlyRect): Entity[] {
    const collisions: Entity[] = []
    if (this.collisionPredicate === CollisionPredicate.NEVER) return collisions

    if (!Rect.intersects(this.bounds, rect))
      // Any collisions requires the rectangle to intersect with the entity's
      // bounds.
      return collisions

    if (this.collisionPredicate & CollisionPredicate.BOUNDS)
      collisions.push(this)

    if (
      this.collisionPredicate & CollisionPredicate.SPRITES &&
      !collisions.length
    ) {
      // Test if any sprite collides.
      if (
        Rect.intersects(this.spriteBounds, rect) &&
        this.sprites.some(sprite => Rect.intersects(rect, sprite.bounds))
      )
        collisions.push(this)
    }

    if (
      this.collisionPredicate & CollisionPredicate.BODIES &&
      !collisions.length
    ) {
      // Test if any body collides.
      if (this.collisionBodies.some(body => Rect.intersects(rect, body)))
        collisions.push(this)
    }

    if (this.collisionPredicate & CollisionPredicate.CHILDREN)
      for (const child of this.children)
        collisions.push(...child.collidesRect(rect))

    // Children are not shared so the collision array will not contain
    // duplicates.
    return collisions
  }

  /** Only entities with velocity are tested for collisions unless update() is
      overridden. */
  collides(_entities: readonly Entity[], _state: UpdateState): UpdateStatus {
    return UpdateStatus.UNCHANGED
  }

  abstract toJSON(): EntityConfig

  private _updatePositionForVelocity(state: UpdateState): UpdateStatus {
    const stopped = !this.velocity.x && !this.velocity.y
    if (stopped) return UpdateStatus.UNCHANGED

    // [todo] level bounds checking
    const from: Readonly<XY> = this.origin.copy()

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

    const to: Readonly<XY> = this.origin.add(translate)
    let status = this.moveTo(to)
    if (!(status & UpdateStatus.UPDATED)) return UpdateStatus.UNCHANGED

    const entities = Level.activeParentsWithPlayer(state.level)

    let collidesWith = EntityCollider.collidesEntities(this, entities)

    if (
      diagonal &&
      collidesWith.some(
        collision => collision.collisionType & CollisionType.OBSTACLE
      )
    ) {
      status |= this.moveTo(new XY(to.x, from.y))
      collidesWith = EntityCollider.collidesEntities(this, entities)
      if (
        collidesWith.some(
          collision => collision.collisionType & CollisionType.OBSTACLE
        )
      ) {
        status |= this.moveTo(new XY(from.x, to.y))
        collidesWith = EntityCollider.collidesEntities(this, entities)
      }
    }

    if (
      collidesWith.some(
        collision => collision.collisionType & CollisionType.OBSTACLE
      )
    )
      status |= this.moveTo(new XY(from.x, from.y))

    status |= this.collides(collidesWith, state)

    return status
  }
}

export namespace Entity {
  /** Outermost references have precedence over destructured properties when
      specified. E.g., velocity > vx. Callers can mutate the referenced objects
      at their own peril. */
  export interface Props<
    Variant extends string = string,
    State extends string = string
  > {
    /** Defaults to EntityID.UNDEFINED. */
    readonly id?: EntityID
    /** Required to be passed by subclass. */
    readonly type: EntityType
    /** Required to be passed by subclass. */
    readonly variant: Variant

    /** Defaults to (0, 0). Not used by reference. */
    readonly position?: Readonly<XY>
    readonly x?: Integer
    readonly y?: Integer

    /** Defaults to (1, 1). Not used by reference. */
    readonly scale?: Readonly<XY>
    readonly sx?: Integer
    readonly sy?: Integer

    /** Defaults to undefined. */
    readonly constituentID?: AtlasID

    /** Defaults to 0. */
    readonly elevation?: Layer

    /** Defaults to (0, 0). */
    readonly velocity?: XY
    readonly vx?: Integer
    readonly vy?: Integer

    /** Required to be passed by subclass. */
    readonly state: State
    /** Required to be passed by subclass. */
    readonly map: Record<State, SpriteRect>

    /** Defaults to BehaviorPredicate.NEVER. */
    readonly updatePredicate?: UpdatePredicate

    /** Defaults to CollisionType.INERT. */
    readonly collisionType?: CollisionType
    /** Defaults to CollisionPredicate.NEVER. */
    readonly collisionPredicate?: CollisionPredicate
    /** Defaults to []. */
    readonly collisionBodies?: Rect[]

    /** Defaults to []. */
    readonly children?: Entity[]
  }

  export interface SubProps<
    Variant extends string = string,
    State extends string = string
  >
    extends Optional<
      Entity.Props<Variant, State>,
      | 'type'
      | 'variant'
      | 'state'
      | 'map'
      | 'updatePredicate'
      | 'collisionType'
      | 'collisionPredicate'
      | 'collisionBodies'
    > {}

  export const defaults = Object.freeze({
    id: EntityID.ANONYMOUS,
    position: Object.freeze(new XY(0, 0)),
    scale: Object.freeze(new XY(1, 1)),
    velocity: Object.freeze(new XY(0, 0)),
    updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
    collisionType: CollisionType.INERT,
    collisionPredicate: CollisionPredicate.NEVER,
    collisionBodies: Object.freeze([]),
    constituentID: undefined,
    elevation: 0
  })

  export function removeAny(
    entities: Entity[],
    member: Readonly<Entity>
  ): boolean {
    for (let i = 0; i < entities.length; ++i) {
      if (entities[i] === member) {
        entities.splice(i, 1)
        return true
      }
      if (entities[i].removeChild(member)) return true
    }
    return false
  }

  export function findAnyByID(
    entities: readonly Entity[],
    id: EntityID
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = entity.findByID(id)
      if (found) return found
    }
    return
  }

  export function descendsAny(
    entities: readonly Readonly<Entity>[],
    entity: Readonly<Entity>
  ): boolean {
    return entities.some(member => member.descends(entity))
  }
}
