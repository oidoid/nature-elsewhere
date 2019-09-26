import {EntityType, UI_KEY_PREFIX} from '../../entity/EntityType'
import {Atlas} from '../../../atlas/atlas/Atlas'
import {Entity} from '../../entity/Entity'
import {Layer} from '../../../images/layer/Layer'
import {ObjectUtil} from '../../../utils/ObjectUtil'
import {NumberUtil} from '../../../math/number/NumberUtil'
import {EntityPicker} from './EntityPicker'
import {IEntityParser} from '../../RecursiveEntityParser'
import {defaultTypeState} from '../../TypeConfigMap'
import {Rect} from '../../../math/rect/Rect'
import {XY} from '../../../math/xy/XY'
import * as memFont from '../../../text/textLayout/memFont.json'

const entityWindowSize = Object.freeze({w: 32, h: 26})
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
      position: {
        x: Math.trunc(picker.bounds.position.x),
        y: Math.trunc(picker.bounds.position.y) + memFont.lineHeight
      },
      size: {...entityWindowSize}
    }
    for (const type of Object.values(EntityType)) {
      if (typeBlacklist.includes(type)) continue
      const entity = parser({type}, atlas)
      const center = XY.max(
        Rect.centerOn(entity.bounds, entityWindowBounds),
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
  const defaultState = defaultTypeState(child.type)
  if (defaultState) Entity.setState(child, defaultState)
  Entity.elevate(child, Layer.UI_PICKER_OFFSET)
}

function getChildStates(child: Entity): readonly (Entity.State | string)[] {
  return Object.keys(child.machine.map).filter(
    state => state !== Entity.State.HIDDEN
  )
}
