import * as CHAR_BACKPACKER from './types/backpacker/backpacker.json'
import * as CHAR_BEE from './types/entity-configs/char/bee.json'
import * as CHAR_BUNNY from './types/entity-configs/char/bunny.json'
import * as CHAR_FLY from './types/entity-configs/char/fly.json'
import * as CHAR_FROG from './types/entity-configs/char/frog.json'
import * as CHAR_SNAKE from './types/entity-configs/char/snake.json'
import * as GROUP from './types/entity-configs/group.json'
import * as IMAGE_ENTITY from './types/image-entity/image-entity.json'
import * as SCENERY_BUSH from './types/entity-configs/scenery/bush.json'
import * as SCENERY_CATTAILS from './types/entity-configs/scenery/cattails.json'
import * as SCENERY_CLOUD from './types/entity-configs/scenery/cloud.json'
import * as SCENERY_CLOVER from './types/entity-configs/scenery/clover.json'
import * as SCENERY_CONIFER from './types/entity-configs/scenery/conifer.json'
import * as SCENERY_FLAG from './types/entity-configs/scenery/flag.json'
import * as SCENERY_GRASS from './types/entity-configs/scenery/grass.json'
import * as SCENERY_ISO_GRASS from './types/entity-configs/scenery/iso-grass.json'
import * as SCENERY_MOUNTAIN from './types/entity-configs/scenery/mountain.json'
import * as SCENERY_PATH from './types/entity-configs/scenery/path.json'
import * as SCENERY_PLANE from './types/entity-configs/scenery/plane.json'
import * as SCENERY_POND from './types/entity-configs/scenery/pond.json'
import * as SCENERY_PYRAMID from './types/entity-configs/scenery/pyramid.json'
import * as SCENERY_SUBSHRUB from './types/entity-configs/scenery/subshrub.json'
import * as SCENERY_TREE from './types/entity-configs/scenery/tree.json'
import * as UI_BUTTON from './types/button/button.json'
import * as UI_CHECKBOX from './types/checkbox/checkbox.json'
import * as UI_CURSOR from './types/cursor/cursor.json'
import * as UI_DATE_VERSION_HASH from './types/date-version-hash/date-version-hash.json'
import * as UI_DESTINATION_MARKER from './types/destination-marker/destination-marker.json'
import * as UI_ENTITY_PICKER from './types/entity-picker/entity-picker.json'
import * as UI_LEVEL_EDITOR_PANEL from './types/level-editor-panel/level-editor-panel.json'
import * as UI_RADIO_BUTTON_GROUP from './types/entity-configs/ui/radio-checkbox-group.json'
import * as UI_TEXT from './types/text/text.json'
import * as UI_TOOLBAR from './types/entity-configs/ui/toolbar.json'
import {EntityConfig} from './entity/entity-config'
import {EntityType} from './entity-type/entity-type'
import {EntityStateParser} from './entity-state/entity-state-parser'
import {EntityState} from './entity-state/entity-state'

export const TypeConfigMap: Readonly<
  Record<EntityType, EntityConfig>
> = Object.freeze({
  [EntityType.CHAR_BACKPACKER]: CHAR_BACKPACKER,
  [EntityType.CHAR_BEE]: CHAR_BEE,
  [EntityType.CHAR_BUNNY]: CHAR_BUNNY,
  [EntityType.CHAR_FLY]: CHAR_FLY,
  [EntityType.CHAR_FROG]: CHAR_FROG,
  [EntityType.CHAR_SNAKE]: CHAR_SNAKE,
  [EntityType.GROUP]: GROUP,
  [EntityType.IMAGE]: IMAGE_ENTITY,
  [EntityType.SCENERY_BUSH]: SCENERY_BUSH,
  [EntityType.SCENERY_CATTAILS]: SCENERY_CATTAILS,
  [EntityType.SCENERY_CLOUD]: SCENERY_CLOUD,
  [EntityType.SCENERY_CLOVER]: SCENERY_CLOVER,
  [EntityType.SCENERY_CONIFER]: SCENERY_CONIFER,
  [EntityType.SCENERY_FLAG]: SCENERY_FLAG,
  [EntityType.SCENERY_GRASS]: SCENERY_GRASS,
  [EntityType.SCENERY_ISO_GRASS]: SCENERY_ISO_GRASS,
  [EntityType.SCENERY_MOUNTAIN]: SCENERY_MOUNTAIN,
  [EntityType.SCENERY_PATH]: SCENERY_PATH,
  [EntityType.SCENERY_PLANE]: SCENERY_PLANE,
  [EntityType.SCENERY_POND]: SCENERY_POND,
  [EntityType.SCENERY_PYRAMID]: SCENERY_PYRAMID,
  [EntityType.SCENERY_SUBSHRUB]: SCENERY_SUBSHRUB,
  [EntityType.SCENERY_TREE]: SCENERY_TREE,
  [EntityType.UI_BUTTON]: UI_BUTTON,
  [EntityType.UI_CHECKBOX]: UI_CHECKBOX,
  [EntityType.UI_CURSOR]: UI_CURSOR,
  [EntityType.UI_DATE_VERSION_HASH]: UI_DATE_VERSION_HASH,
  [EntityType.UI_DESTINATION_MARKER]: UI_DESTINATION_MARKER,
  [EntityType.UI_ENTITY_PICKER]: UI_ENTITY_PICKER,
  [EntityType.UI_LEVEL_EDITOR_PANEL]: UI_LEVEL_EDITOR_PANEL,
  [EntityType.UI_RADIO_CHECKBOX_GROUP]: UI_RADIO_BUTTON_GROUP,
  [EntityType.UI_TEXT]: UI_TEXT,
  [EntityType.UI_TOOLBAR]: UI_TOOLBAR
})

export function defaultTypeState(type: EntityType): EntityState | string {
  return EntityStateParser.parse(TypeConfigMap[type].state)
}
