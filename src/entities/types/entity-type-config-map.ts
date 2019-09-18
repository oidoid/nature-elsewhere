import {EntityType} from './entity-type'
import {EntityConfig} from '../parsers/entity-config'
import * as CHAR_BACKPACKER from '../../assets/entities/char/backpacker.json'
import * as CHAR_BEE from '../../assets/entities/char/bee.json'
import * as CHAR_BUNNY from '../../assets/entities/char/bunny.json'
import * as CHAR_FLY from '../../assets/entities/char/fly.json'
import * as CHAR_FROG from '../../assets/entities/char/frog.json'
import * as CHAR_SNAKE from '../../assets/entities/char/snake.json'
import * as SCENERY_BUSH from '../../assets/entities/scenery/bush.json'
import * as SCENERY_CATTAILS from '../../assets/entities/scenery/cattails.json'
import * as SCENERY_CLOUD from '../../assets/entities/scenery/cloud.json'
import * as SCENERY_CLOVER from '../../assets/entities/scenery/clover.json'
import * as SCENERY_CONIFER from '../../assets/entities/scenery/conifer.json'
import * as SCENERY_FLAG from '../../assets/entities/scenery/flag.json'
import * as SCENERY_GRASS from '../../assets/entities/scenery/grass.json'
import * as SCENERY_ISO_GRASS from '../../assets/entities/scenery/iso-grass.json'
import * as SCENERY_MOUNTAIN from '../../assets/entities/scenery/mountain.json'
import * as SCENERY_PATH from '../../assets/entities/scenery/path.json'
import * as SCENERY_PLANE from '../../assets/entities/scenery/plane.json'
import * as SCENERY_POND from '../../assets/entities/scenery/pond.json'
import * as SCENERY_PYRAMID from '../../assets/entities/scenery/pyramid.json'
import * as SCENERY_SUBSHRUB from '../../assets/entities/scenery/subshrub.json'
import * as SCENERY_TREE from '../../assets/entities/scenery/tree.json'
import * as UI_BUTTON from '../../assets/entities/ui/button.json'
import * as UI_CURSOR from '../../assets/entities/ui/cursor.json'
import * as UI_DATE_VERSION_HASH from '../../assets/entities/ui/date-version-hash.json'
import * as UI_DESTINATION_MARKER from '../../assets/entities/ui/destination-marker.json'
import * as UI_LEVEL_EDITOR_PANEL from '../../assets/entities/ui/level-editor-panel.json'
import * as UI_ENTITY_PICKER from '../../assets/entities/ui/entity-picker.json'
import * as UI_TEXT from '../../assets/entities/ui/text.json'
import * as UI_TOOLBAR from '../../assets/entities/ui/toolbar.json'
import * as UI_RADIO_BUTTON_GROUP from '../../assets/entities/ui/radio-checkbox-group.json'
import * as UI_CHECKBOX from '../../assets/entities/ui/checkbox.json'
import * as GROUP from '../../assets/entities/group.json'
import * as UI_TINY_BACKPACKER from '../../assets/entities/ui/tiny-backpacker.json'

export const EntityTypeConfigMap: Readonly<
  Record<EntityType, EntityConfig>
> = Object.freeze({
  [EntityType.CHAR_BACKPACKER]: CHAR_BACKPACKER,
  [EntityType.CHAR_BEE]: CHAR_BEE,
  [EntityType.CHAR_BUNNY]: CHAR_BUNNY,
  [EntityType.CHAR_FLY]: CHAR_FLY,
  [EntityType.CHAR_FROG]: CHAR_FROG,
  [EntityType.CHAR_SNAKE]: CHAR_SNAKE,
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
  [EntityType.UI_CURSOR]: UI_CURSOR,
  [EntityType.UI_DATE_VERSION_HASH]: UI_DATE_VERSION_HASH,
  [EntityType.UI_DESTINATION_MARKER]: UI_DESTINATION_MARKER,
  [EntityType.UI_LEVEL_EDITOR_PANEL]: UI_LEVEL_EDITOR_PANEL,
  [EntityType.UI_ENTITY_PICKER]: UI_ENTITY_PICKER,
  [EntityType.UI_RADIO_CHECKBOX_GROUP]: UI_RADIO_BUTTON_GROUP,
  [EntityType.UI_CHECKBOX]: UI_CHECKBOX,
  [EntityType.UI_TEXT]: UI_TEXT,
  [EntityType.UI_TOOLBAR]: UI_TOOLBAR,
  [EntityType.UI_TINY_BACKPACKER]: UI_TINY_BACKPACKER,
  [EntityType.GROUP]: GROUP
})
