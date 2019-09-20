import {LevelEditorPanelParser} from './types/level-editor-panel/level-editor-panel-parser'
import {EntityType} from './entity-type/entity-type'
import {CursorParser} from './types/cursor/cursor-parser'
import {TextParser} from './types/text/text-parser'
import {CloudParser} from './types/cloud/cloud-parser'
import {DateVersionHashParser} from './types/date-version-hash/date-version-hash-parser'
import {BackpackerParser} from './types/backpacker/backpacker-parser'
import {EntityTypeParse} from './entity-type-parser'
import {ButtonParser} from './types/button/button-parser'
import {CheckboxParser} from './types/checkbox/checkbox-parser'
import {EntityPickerParser} from './types/entity-picker/entity-picker-parser'

export namespace EntityTypeConfigParserMap {
  export function map(type: EntityType): Maybe<EntityTypeParse> {
    const EntityTypeConfigParserMap: Readonly<
      Partial<Record<EntityType, EntityTypeParse>>
    > = {
      [EntityType.CHAR_BACKPACKER]: BackpackerParser.parse,
      [EntityType.CHAR_BEE]: entity => entity,
      [EntityType.CHAR_BUNNY]: entity => entity,
      [EntityType.CHAR_FLY]: entity => entity,
      [EntityType.CHAR_FROG]: entity => entity,
      [EntityType.CHAR_SNAKE]: entity => entity,
      [EntityType.SCENERY_BUSH]: entity => entity,
      [EntityType.SCENERY_CATTAILS]: entity => entity,
      [EntityType.SCENERY_CLOUD]: CloudParser.parse,
      [EntityType.SCENERY_CLOVER]: entity => entity,
      [EntityType.SCENERY_CONIFER]: entity => entity,
      [EntityType.SCENERY_FLAG]: entity => entity,
      [EntityType.SCENERY_ISO_GRASS]: entity => entity,
      [EntityType.SCENERY_GRASS]: entity => entity,
      [EntityType.SCENERY_MOUNTAIN]: entity => entity,
      [EntityType.SCENERY_PATH]: entity => entity,
      [EntityType.SCENERY_PLANE]: entity => entity,
      [EntityType.SCENERY_POND]: entity => entity,
      [EntityType.SCENERY_PYRAMID]: entity => entity,
      [EntityType.SCENERY_SUBSHRUB]: entity => entity,
      [EntityType.SCENERY_TREE]: entity => entity,
      [EntityType.UI_BUTTON]: ButtonParser.parse,
      [EntityType.UI_CURSOR]: CursorParser.parse,
      [EntityType.UI_DATE_VERSION_HASH]: DateVersionHashParser.parse,
      [EntityType.UI_CHECKBOX]: CheckboxParser.parse,
      [EntityType.UI_DESTINATION_MARKER]: entity => entity,
      [EntityType.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanelParser.parse,
      [EntityType.UI_ENTITY_PICKER]: EntityPickerParser.parse,
      [EntityType.UI_TEXT]: TextParser.parse,
      [EntityType.UI_TOOLBAR]: entity => entity
    }
    return EntityTypeConfigParserMap[type]
  }
}
