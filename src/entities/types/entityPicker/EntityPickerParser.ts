import {EntityType, UI_KEY_PREFIX} from '../../../entity/EntityType'
import {Atlas} from '../../../atlas/Atlas'
import {Entity} from '../../../entity/Entity'
import {Layer} from '../../../image/Layer'
import {ObjectUtil} from '../../../utils/ObjectUtil'
import {NumberUtil} from '../../../math/NumberUtil'
import {EntityPicker} from './EntityPicker'
import {IEntityParser} from '../../RecursiveEntityParser'
import {Rect} from '../../../math/Rect'
import {XY} from '../../../math/XY'
import * as memFont from '../../../text/memFont.json'
import {WH} from '../../../math/WH'

const entityWindowSize: Readonly<WH> = Object.freeze(new WH(32, 26))
const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
  EntityType.IMAGE,
  ...ObjectUtil.keys(EntityType)
    .filter(type => type.startsWith(UI_KEY_PREFIX))
    .map(key => EntityType[key])
])

export namespace EntityPickerParser {
  export function parse(
    picker: Entity,
    atlas: Atlas,
    parser: IEntityParser
  ): EntityPicker {
    if (!Entity.assert<EntityPicker>(picker, EntityType.UI_ENTITY_PICKER))
      throw new Error()
    const entityWindowBounds = {
      position: new XY(
        Math.trunc(picker.bounds.position.x),
        Math.trunc(picker.bounds.position.y) + memFont.lineHeight
      ),
      size: entityWindowSize.copy()
    }
    for (const type of Object.values(EntityType)) {
      if (typeBlacklist.includes(type)) continue
      const entity = parser({type}, atlas)
      const center = Rect.centerOn(entity.bounds, entityWindowBounds).max(
        entityWindowBounds.position
      )
      Entity.moveTo(entity, center)
      Entity.setState(entity, Entity.State.HIDDEN)
      picker.children.push(entity)
    }
    picker.activeChildIndex = 0
    showActiveChild(picker)
    return picker
  }

  export function getActiveChild(picker: EntityPicker): Maybe<Entity> {
    return picker.children[picker.activeChildIndex]
  }

  export function setActiveChild(picker: EntityPicker, index: number): void {
    if (!picker.children.length) return
    hideActiveChild(picker)
    picker.activeChildIndex = NumberUtil.wrap(index, 0, picker.children.length)
    showActiveChild(picker)
  }

  export function getActiveChildStateIndex(picker: EntityPicker): number {
    const child = getActiveChild(picker)
    if (!child) return 0
    return getChildStates(child).indexOf(child.machine.state)
  }

  export function offsetActiveChildStateIndex(
    picker: EntityPicker,
    offset: number
  ): void {
    const child = getActiveChild(picker)
    if (!child) return
    const states = getChildStates(child)
    const index = NumberUtil.wrap(
      states.indexOf(child.machine.state) + offset,
      0,
      states.length
    )
    const state = states[index]
    Entity.setState(child, state)
  }
}

function hideActiveChild(picker: EntityPicker): void {
  const child = EntityPickerParser.getActiveChild(picker)
  if (!child) return
  Entity.elevate(child, -Layer.UI_PICKER_OFFSET)
  Entity.setState(child, Entity.State.HIDDEN)
}

function showActiveChild(picker: EntityPicker): void {
  const child = EntityPickerParser.getActiveChild(picker)
  if (!child) return
  const defaultState = child.machine.state //defaultTypeState(child.type)
  if (defaultState) Entity.setState(child, defaultState)
  Entity.elevate(child, Layer.UI_PICKER_OFFSET)
}

function getChildStates(child: Entity): readonly (Entity.State | string)[] {
  return Object.keys(child.machine.map).filter(
    state => state !== Entity.State.HIDDEN
  )
}
