import {EntityTypeUtil} from '../../entityType/EntityTypeUtil'
import {EntityUtil} from '../../entity/EntityUtil'
import {EntityState} from '../../entityState/EntityState'
import {EntityType, UI_KEY_PREFIX} from '../../entityType/EntityType'
import {Atlas} from '../../../atlas/atlas/Atlas'
import {Entity} from '../../entity/Entity'
import {Layer} from '../../../images/layer/layer'
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
    if (
      !EntityTypeUtil.assert<EntityPicker>(picker, EntityType.UI_ENTITY_PICKER)
    )
      throw new Error()
    const entityWindowBounds = {
      x: Math.trunc(picker.bounds.x),
      y: Math.trunc(picker.bounds.y) + memFont.lineHeight,
      w: entityWindowSize.w,
      h: entityWindowSize.h
    }
    for (const type of Object.values(EntityType)) {
      if (typeBlacklist.includes(type)) continue
      const entity = parser({type}, atlas)
      const center = XY.max(
        Rect.centerOn(entity.bounds, entityWindowBounds),
        entityWindowBounds
      )
      EntityUtil.moveTo(entity, center)
      EntityUtil.setState(entity, EntityState.HIDDEN)
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
    return getChildStates(child).indexOf(child.state)
  }

  export function offsetActiveChildStateIndex(
    picker: EntityPicker,
    offset: number
  ): void {
    const child = getActiveChild(picker)
    if (!child) return
    const states = getChildStates(child)
    const index = NumberUtil.wrap(
      states.indexOf(child.state) + offset,
      0,
      states.length
    )
    const state = states[index]
    EntityUtil.setState(child, state)
  }
}

function hideActiveChild(picker: EntityPicker): void {
  const child = EntityPickerParser.getActiveChild(picker)
  if (!child) return
  EntityUtil.elevate(child, -Layer.UI_PICKER_OFFSET)
  EntityUtil.setState(child, EntityState.HIDDEN)
}

function showActiveChild(picker: EntityPicker): void {
  const child = EntityPickerParser.getActiveChild(picker)
  if (!child) return
  const defaultState = defaultTypeState(child.type)
  if (defaultState) EntityUtil.setState(child, defaultState)
  EntityUtil.elevate(child, Layer.UI_PICKER_OFFSET)
}

function getChildStates(child: Entity): readonly (EntityState | string)[] {
  return Object.keys(child.imageStates).filter(
    state => state !== EntityState.HIDDEN
  )
}
