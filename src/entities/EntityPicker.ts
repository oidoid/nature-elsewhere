import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {EntityFactory} from '../entity/EntityFactory'
import {Entity} from '../entity/Entity'
import {EntityType, UI_KEY_PREFIX} from '../entity/EntityType'
import {Layer} from '../image/Layer'
import * as memFont from '../text/memFont.json'
import {NumberUtil} from '../math/NumberUtil'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Rect, ReadonlyRect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {WH} from '../math/WH'
import {XY} from '../math/XY'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'

const pickerSize: Readonly<WH> = Object.freeze(new WH(32, 27))
const entityWindowSize: Readonly<WH> = Object.freeze(
  new WH(pickerSize.w, pickerSize.h - 1)
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
    this._activeChildIndex = 0

    const entityWindowBounds = this._entityWindowBounds()
    for (const child of this.children) {
      const center = Rect.centerOn(child.bounds, entityWindowBounds).max(
        entityWindowBounds.position
      )
      child.moveTo(center)
      child.transition(Entity.BaseState.HIDDEN)
    }
    this.showActiveChild()
    this.invalidateBounds()
    this.forceSizeTo(pickerSize)
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
    this.hideActiveChild()
    this._activeChildIndex = NumberUtil.wrap(index, 0, this.children.length)
    this.showActiveChild()
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
    const variant = variants[index]
    const newChild = EntityFactory.produce(atlas, {
      type: oldChild.type,
      variant,
      state: oldChild.state()
    })
    newChild.moveTo(oldChild.bounds.position)
    newChild.elevate(2 * Layer.UI_PICKER_OFFSET)
    this.replaceChild(oldChild, newChild)
  }

  private _entityWindowBounds(): ReadonlyRect {
    return {
      position: new XY(
        this.bounds.position.x - 1,
        this.bounds.position.y + 1 + memFont.lineHeight
      ),
      size: entityWindowSize
    }
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
  }

  private hideActiveChild(): void {
    const child = this.getActiveChild()
    if (!child) return
    child.elevate(-2 * Layer.UI_PICKER_OFFSET)
  }

  private showActiveChild(): void {
    this.hideActiveChild()
    const child = this.getActiveChild()
    if (!child) return
    // const defaultState = getChildStates(child)[0]
    child.elevate(2 * Layer.UI_PICKER_OFFSET)
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

function getChildStates(child: Entity): readonly (string)[] {
  return child.states().filter(state => state !== Entity.BaseState.HIDDEN)
}

const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
  EntityType.LEVEL_EDITOR_SANDBOX,
  EntityType.PLANE,
  ...ObjectUtil.keys(EntityType)
    .filter(type => type.startsWith(UI_KEY_PREFIX))
    .map(key => EntityType[key])
])

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
