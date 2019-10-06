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

const entityWindowSize: Readonly<WH> = Object.freeze(new WH(32, 26))

export class EntityPicker extends Entity<EntityPicker.State> {
  private _activeChildIndex: number
  constructor(atlas: Atlas, props?: Entity.SubProps<EntityPicker.State>) {
    super({
      type: EntityType.UI_ENTITY_PICKER,
      updatePredicate: UpdatePredicate.ALWAYS,
      state: EntityPicker.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [EntityPicker.State.VISIBLE]: new ImageRect()
      },
      collisionType: CollisionType.TYPE_UI,
      children: makeChildren(atlas),
      ...props
    })
    this._activeChildIndex = 0

    const entityWindowBounds: ReadonlyRect = {
      position: new XY(
        this.bounds.position.x + 1,
        this.bounds.position.y + 4 + memFont.lineHeight
      ),
      size: entityWindowSize
    }
    for (const child of this.children) {
      const center = Rect.centerOn(child.bounds, entityWindowBounds).max(
        entityWindowBounds.position
      )
      child.moveTo(center)
      child.setState(Entity.BaseState.HIDDEN)
    }
    this.showActiveChild()
    this.invalidateBounds()
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
      states.indexOf(child.machine.state) + offset,
      0,
      states.length
    )
    const state = states[index]
    child.setState(state)
  }

  private hideActiveChild(): void {
    const child = this.getActiveChild()
    if (!child) return
    child.elevate(-Layer.UI_PICKER_OFFSET)
    child.setState(Entity.BaseState.HIDDEN)
  }

  private showActiveChild(): void {
    const child = this.getActiveChild()
    if (!child) return
    const defaultState = getChildStates(child)[0]
    if (defaultState) child.setState(defaultState)
    child.elevate(Layer.UI_PICKER_OFFSET)
  }
}

export namespace EntityPicker {
  export enum State {
    VISIBLE = 'visible'
  }
}

function getChildStates(child: Entity): readonly (string)[] {
  return child.machine
    .getStates()
    .filter(state => state !== Entity.BaseState.HIDDEN)
}

const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
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
