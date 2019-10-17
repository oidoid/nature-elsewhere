import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {EntityFactory} from '../entity/EntityFactory'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType, UI_KEY_PREFIX} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {NumberUtil} from '../math/NumberUtil'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Rect, ReadonlyRect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

const pickerSize: Readonly<WH> = Object.freeze(new WH(33, 25))
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
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [EntityPicker.State.VISIBLE]: new ImageRect()
      },
      children: makeChildren(atlas),
      ...props
    })
    for (const child of this.children)
      child.elevate(-2 * Layer.UI_PICKER_OFFSET)
    this._activeChildIndex = 0
    this._showActiveChild()
  }

  invalidateBounds(): void {
    this._bounds.size.w = pickerSize.w
    this._bounds.size.h = pickerSize.h
  }

  update(state: UpdateState): UpdateStatus {
    return super.update(state, true) // Children are forbidden from updating.
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
    const states = getChildStates(child)
    const index = NumberUtil.wrap(
      states.indexOf(child.state()) + offset,
      0,
      states.length
    )
    const state = states[index]
    child.transition(state)
  }

  offsetActiveChildVariantIndex(atlas: Atlas, offset: number): void {
    const oldChild = this.getActiveChild()
    if (!oldChild) return
    const variants = oldChild.variants()
    const index = NumberUtil.wrap(
      variants.indexOf(oldChild.variant) + offset,
      0,
      variants.length
    )
    const variant = oldChild.variants()[index]
    this.setActiveChildVariant(atlas, variant)
  }

  setActiveChildVariant(atlas: Atlas, variant: string): void {
    const oldChild = this.getActiveChild()
    if (!oldChild) return
    const newChild = EntityFactory.produce(atlas, {
      type: oldChild.type,
      variant,
      state: oldChild.state()
    })
    this._centerChild(newChild)
    newChild.elevate(2 * Layer.UI_PICKER_OFFSET)
    this.replaceChild(oldChild, newChild)
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }

  private _entityWindowBounds(): ReadonlyRect {
    return {
      position: new XY(this.bounds.position.x, this.bounds.position.y),
      size: entityWindowSize
    }
  }

  private _hideActiveChild(): void {
    const child = this.getActiveChild()
    if (!child) return
    child.elevate(-2 * Layer.UI_PICKER_OFFSET)
  }

  private _showActiveChild(): void {
    this._hideActiveChild()
    const child = this.getActiveChild()
    if (!child) return

    this._centerChild(child)

    // const defaultState = getChildStates(child)[0]
    child.elevate(2 * Layer.UI_PICKER_OFFSET)
  }

  private _centerChild(child: Entity): void {
    const entityWindowBounds = this._entityWindowBounds()
    const center = Rect.centerOn(child.bounds, entityWindowBounds).max(
      entityWindowBounds.position
    )
    child.moveTo(center)
  }
}

export namespace EntityPicker {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

function getChildStates(child: Entity): readonly string[] {
  return child.states().filter(state => state !== Entity.BaseState.HIDDEN)
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

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_ENTITY_PICKER,
  variant: EntityPicker.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  state: EntityPicker.State.VISIBLE,
  collisionType: CollisionType.TYPE_UI
})

const typeBlacklist: readonly string[] = ObjectUtil.freeze([
  EntityType.GROUP,
  EntityType.LEVEL_EDITOR_SANDBOX,
  EntityType.PLANE,
  ...ObjectUtil.keys(EntityType)
    .filter(type => type.startsWith(UI_KEY_PREFIX))
    .map(key => EntityType[key])
])
