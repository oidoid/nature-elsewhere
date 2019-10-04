import * as memFont from '../../../text/memFont.json'
import {Entity} from '../../../entity/Entity'
import {Layer} from '../../../image/Layer'
import {NumberUtil} from '../../../math/NumberUtil'
import {Rect, ReadonlyRect} from '../../../math/Rect'
import {WH} from '../../../math/WH'
import {XY} from '../../../math/XY'
import {EntityType} from '../../../entity/EntityType'
import {UpdatePredicate} from '../../updaters/updatePredicate/UpdatePredicate'
import {CollisionType} from '../../../collision/CollisionType'

const entityWindowSize: Readonly<WH> = Object.freeze(new WH(32, 26))

export class EntityPicker extends Entity {
  private _activeChildIndex: number
  constructor(props?: Entity.Props) {
    super({
      type: EntityType.UI_ENTITY_PICKER,
      updatePredicate: UpdatePredicate.ALWAYS,
      collisionType: CollisionType.TYPE_UI,
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
      child.setState(Entity.State.HIDDEN)
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

  getActiveChildStateIndex(): number {
    const child = this.getActiveChild()
    if (!child) return 0
    return getChildStates(child).indexOf(child.machine.state)
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
    child.setState(Entity.State.HIDDEN)
  }

  private showActiveChild(): void {
    const child = this.getActiveChild()
    if (!child) return
    const defaultState = getChildStates(child)[0]
    if (defaultState) child.setState(defaultState)
    child.elevate(Layer.UI_PICKER_OFFSET)
  }
}

function getChildStates(child: Entity): readonly (Entity.State | string)[] {
  return child.machine
    .getStates()
    .filter(state => state !== Entity.State.HIDDEN)
}
