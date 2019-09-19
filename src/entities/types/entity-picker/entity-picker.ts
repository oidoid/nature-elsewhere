import {Atlas} from '../../../atlas/atlas/atlas'
import {Entity} from '../../entity/entity'
import {EntityState} from '../../entity-state/entity-state'
import {EntityTypeConfigMap} from '../../entity-type-config-map/entity-type-config-map'
import {EntityType} from '../../entity-type/entity-type'
import {Layer} from '../../../images/layer/layer'
import {ObjectUtil} from '../../../utils/object-util'
import {NumberUtil} from '../../../math/number/number-util'
import {EntityParser} from '../../entity/entity-parser'

export interface EntityPicker extends Entity {
  readonly type: EntityType.UI_ENTITY_PICKER
  activeChildIndex: number
}

const pickerBounds = Object.freeze({w: 32, h: 26})
const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
  ...(<string[]>ObjectUtil.keys(EntityType)
    .filter(type => type.startsWith('UI_'))
    .map(key => EntityType[key])
    .filter(val => typeof val === 'string'))
])

export namespace EntityPicker {
  export function parse(picker: Entity, atlas: Atlas): EntityPicker {
    if (!EntityType.assert<EntityPicker>(picker, EntityType.UI_ENTITY_PICKER))
      throw new Error()
    for (const config of Object.values(EntityTypeConfigMap)) {
      if (typeBlacklist.includes(config.type)) continue
      const entity = EntityParser.parse(config, atlas)
      Entity.moveTo(entity, {
        x: Math.max(
          picker.bounds.x,
          picker.bounds.x + (pickerBounds.w - entity.bounds.w) / 2
        ),
        y: Math.max(
          picker.bounds.y + 6,
          picker.bounds.y + 6 + (pickerBounds.h - entity.bounds.h) / 2
        )
      })
      Entity.setState(entity, EntityState.HIDDEN)
      picker.children.push(entity)
    }
    picker.activeChildIndex = 0
    setChildLayerOffset(picker.children[0], Layer.UI_PICKER_OFFSET)
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
      setChildLayerOffset(oldChild, -Layer.UI_PICKER_OFFSET)
      Entity.setState(oldChild, EntityState.HIDDEN)
    }
    picker.activeChildIndex = NumberUtil.wrap(index, 0, picker.children.length)
    const child = picker.children[Math.abs(picker.activeChildIndex)]
    const defaultState = EntityTypeConfigMap[child.type].state
    if (defaultState) Entity.setState(child, defaultState)
    setChildLayerOffset(child, Layer.UI_PICKER_OFFSET)
  }
}

function setChildLayerOffset(entity: Entity, increment: Layer): void {
  for (const state in entity.imageStates) {
    entity.imageStates[state].images.forEach(
      image => (image.layer += increment)
    )
  }
  entity.children.forEach(child => setChildLayerOffset(child, increment))
}
