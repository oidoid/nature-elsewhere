import {Atlas} from 'aseprite-atlas'
import {Entity} from '../../../entity/Entity'
import {EntityPicker} from './EntityPicker'
import {EntityType, UI_KEY_PREFIX} from '../../../entity/EntityType'
import {IEntityParser} from '../../RecursiveEntityParser'
import {ObjectUtil} from '../../../utils/ObjectUtil'

const typeBlacklist: readonly string[] = Object.freeze([
  EntityType.GROUP,
  EntityType.IMAGE,
  ...ObjectUtil.keys(EntityType)
    .filter(type => type.startsWith(UI_KEY_PREFIX))
    .map(key => EntityType[key])
])

export namespace EntityPickerParser {
  export function parse(
    props: Entity.Props,
    atlas: Atlas,
    parser: IEntityParser
  ): EntityPicker {
    const children: Entity[] = []
    for (const type of Object.values(EntityType)) {
      if (typeBlacklist.includes(type)) continue
      const entity = parser({type}, atlas)
      children.push(entity)
    }
    return new EntityPicker({...props, children})
  }
}
