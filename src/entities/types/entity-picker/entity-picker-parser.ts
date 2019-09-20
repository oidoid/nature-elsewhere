import {EntityParser} from '../../entity/entity-parser'
import {EntityTypeConfigMap} from '../../entity-type-config-map/entity-type-config-map'
import {EntityTypeUtil} from '../../entity-type/entity-type-util'
import {EntityUtil} from '../../entity/entity-util'
import {EntityState} from '../../entity-state/entity-state'
import {EntityType} from '../../entity-type/entity-type'
import {Atlas} from '../../../atlas/atlas/atlas'
import {Entity} from '../../entity/entity'
import {Layer} from '../../../images/layer/layer'
import {ObjectUtil} from '../../../utils/object-util'
import {NumberUtil} from '../../../math/number/number-util'
import {EntityPicker} from './entity-picker'

const size = Object.freeze({w: 32, h: 26})
const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
  ...ObjectUtil.keys(EntityType)
    .filter(type => type.startsWith(EntityType.UI_KEY_PREFIX))
    .map(key => EntityType[key])
])

export namespace EntityPickerParser {
  export function parse(picker: Entity, atlas: Atlas): EntityPicker {
    if (
      !EntityTypeUtil.assert<EntityPicker>(picker, EntityType.UI_ENTITY_PICKER)
    )
      throw new Error()
    for (const type of Object.values(EntityType)) {
      if (typeBlacklist.includes(type)) continue
      const entity = EntityParser.parse({type}, atlas)
      EntityUtil.moveTo(entity, {
        x: Math.max(
          picker.bounds.x,
          picker.bounds.x + (size.w - entity.bounds.w) / 2
        ),
        y: Math.max(
          picker.bounds.y + 6,
          picker.bounds.y + 6 + (size.h - entity.bounds.h) / 2
        )
      })
      EntityUtil.setState(entity, EntityState.HIDDEN)
      picker.children.push(entity)
    }
    picker.activeChildIndex = 0
    EntityUtil.elevate(picker.children[0], Layer.UI_PICKER_OFFSET)
    setVisibleChild(picker, 0)
    return picker
  }

  export function getVisibleChild(picker: EntityPicker): Entity {
    return picker.children[picker.activeChildIndex]
  }

  export function setVisibleChild(picker: EntityPicker, index: number): void {
    if (!picker.children.length) return
    const oldChild = picker.children[Math.abs(picker.activeChildIndex)]
    if (oldChild) {
      EntityUtil.elevate(oldChild, -Layer.UI_PICKER_OFFSET)
      EntityUtil.setState(oldChild, EntityState.HIDDEN)
    }
    picker.activeChildIndex = NumberUtil.wrap(index, 0, picker.children.length)
    const child = picker.children[Math.abs(picker.activeChildIndex)]
    const defaultState = EntityTypeConfigMap[child.type].state
    if (defaultState) EntityUtil.setState(child, defaultState)
    EntityUtil.elevate(child, Layer.UI_PICKER_OFFSET)
  }
}
