import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'
import {EntityState} from '../../entity-state/entity-state'
import {EntityType, UI_KEY_PREFIX} from '../../entity-type/entity-type'
import {Atlas} from '../../../atlas/atlas/atlas'
import {Entity} from '../../entity/entity'
import {Layer} from '../../../images/layer/layer'
import {ObjectUtil} from '../../../utils/object-util'
import {NumberUtil} from '../../../math/number/number-util'
import {EntityPicker} from './entity-picker'
import {IEntityParser} from '../../recursive-entity-parser'
import {defaultTypeState} from '../../type-config-map'
import {Rect} from '../../../math/rect/rect'
import {XY} from '../../../math/xy/xy'
import * as memFont from '../../../text/text-layout/mem-font.json'

const entityWindowSize = Object.freeze({w: 32, h: 26})
const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
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
    for (const type of Object.values(EntityType)) {
      if (typeBlacklist.includes(type)) continue
      const entity = parser({type}, atlas)
      const entityWindowBounds = {
        x: Math.trunc(picker.bounds.x),
        y: Math.trunc(picker.bounds.y) + memFont.lineHeight,
        w: entityWindowSize.w,
        h: entityWindowSize.h
      }
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
