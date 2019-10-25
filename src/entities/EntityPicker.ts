import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityFactory} from '../entity/EntityFactory'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType, UI_KEY_PREFIX} from '../entity/EntityType'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {NumberUtil} from '../math/NumberUtil'
import {ProcessChildren} from '../entity/ProcessChildren'
import {ReadonlyRect, Rect} from '../math/Rect'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {WH} from '../math/WH'

const pickerSize: Readonly<WH> = Object.freeze(new WH(33, 29))
const entityWindowSize: Readonly<WH> = Object.freeze(
  new WH(pickerSize.w, pickerSize.h)
)

export class EntityPicker extends Entity<
  EntityPicker.Variant,
  EntityPicker.State
> {
  private _activeChildIndex: number
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<EntityPicker.Variant, EntityPicker.State>
  ) {
    super({
      ...defaults,
      elevation: Layer.UI_PICKER_OFFSET,
      map: {
        [EntityPicker.State.NONE]: new SpriteRect()
      },
      children: makeChildren(atlas),
      ...props
    })

    for (const child of this.children) {
      child.elevateTo(0)
      // Hiding the child means lowering the elevation. However, the child still
      // has to be centered to ensure the picker covers it.
      this._centerChild(child)
    }
    this._activeChildIndex = 0
    this._showActiveChild()
  }

  invalidateBounds(): void {
    this._bounds.size.w = pickerSize.w
    this._bounds.size.h = pickerSize.h
  }

  update(state: UpdateState): UpdateStatus {
    // Children are forbidden from updating.
    return super.update(state, ProcessChildren.SKIP)
  }

  get activeChildIndex(): number {
    return this._activeChildIndex
  }

  getActiveChild(): Maybe<Entity> {
    return this.children[this.activeChildIndex]
  }

  setActiveChild(index: number): void {
    if (!this.children.length) return
    this._hideActiveChild()
    this._activeChildIndex = NumberUtil.wrap(index, 0, this.children.length)
    this._showActiveChild()
  }

  offsetActiveChildStateIndex(offset: number): void {
    const child = this.getActiveChild()
    if (!child) return
    const states = child.states
    const index = NumberUtil.wrap(
      states.indexOf(child.state) + offset,
      0,
      states.length
    )
    const state = states[index]
    child.transition(state)
  }

  offsetActiveChildVariantIndex(atlas: Atlas, offset: number): void {
    const oldChild = this.getActiveChild()
    if (!oldChild) return
    const variants = oldChild.variants
    const index = NumberUtil.wrap(
      variants.indexOf(oldChild.variant) + offset,
      0,
      variants.length
    )
    const variant = oldChild.variants[index]
    this.setActiveChildVariant(atlas, variant)
  }

  setActiveChildVariant(atlas: Atlas, variant: string): void {
    const oldChild = this.getActiveChild()
    if (!oldChild) return
    const newChild = EntityFactory.produce(atlas, {
      type: oldChild.type,
      variant,
      state: oldChild.state
    })
    this._centerChild(newChild)
    newChild.elevateTo(this.elevation)
    this.replaceChild(oldChild, newChild)
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }

  private _entityWindowBounds(): ReadonlyRect {
    return {
      position: this.origin.copy(),
      size: entityWindowSize
    }
  }

  private _hideActiveChild(): void {
    const child = this.getActiveChild()
    if (!child) return
    child.elevateTo(0)
  }

  private _showActiveChild(): void {
    this._hideActiveChild()
    const child = this.getActiveChild()
    if (!child) return
    this._centerChild(child)
    child.elevateTo(this.elevation)
  }

  private _centerChild(child: Entity): void {
    const entityWindowBounds = this._entityWindowBounds()
    const center = Rect.centerOn(child.bounds, entityWindowBounds).max(
      entityWindowBounds.position
    )
    child.moveBoundsTo(center)
  }
}

export namespace EntityPicker {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }
}

function makeChildren(atlas: Atlas): Entity[] {
  const children = []
  for (const type of Object.values(EntityType)) {
    if (typeBlacklist.includes(type)) continue
    const entity = EntityFactory.produce(atlas, {type})
    children.push(entity)
  }
  return children
}

const defaults = Object.freeze({
  type: EntityType.UI_ENTITY_PICKER,
  variant: EntityPicker.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  state: EntityPicker.State.NONE,
  collisionType: CollisionType.TYPE_UI
})

const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
  EntityType.LEVEL_EDITOR_SANDBOX,
  EntityType.COMPARTMENT,
  EntityType.BACKPACKER_ICON,
  EntityType.LIFE_COUNTER,
  EntityType.PLANE,
  ...Object.keys(EntityType)
    .filter(typeKey => typeKey.startsWith(UI_KEY_PREFIX))
    .map(typeKey => EntityType[<keyof typeof EntityType>typeKey])
])
