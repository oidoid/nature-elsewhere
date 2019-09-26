import * as CHAR_BACKPACKER from './types/backpacker/backpacker.json'
import * as CHAR_BEE from './types/entityConfigs/char/bee.json'
import * as CHAR_BUNNY from './types/entityConfigs/char/bunny.json'
import * as CHAR_FLY from './types/entityConfigs/char/fly.json'
import * as CHAR_FROG from './types/entityConfigs/char/frog.json'
import * as CHAR_SNAKE from './types/entityConfigs/char/snake.json'
import * as GROUP from './types/entityConfigs/group.json'
import * as IMAGE_ENTITY from './types/imageEntity/imageEntity.json'
import * as SCENERY_BUSH from './types/entityConfigs/scenery/bush.json'
import * as SCENERY_CATTAILS from './types/entityConfigs/scenery/cattails.json'
import * as SCENERY_CLOUD from './types/entityConfigs/scenery/cloud.json'
import * as SCENERY_CLOVER from './types/entityConfigs/scenery/clover.json'
import * as SCENERY_CONIFER from './types/entityConfigs/scenery/conifer.json'
import * as SCENERY_FLAG from './types/entityConfigs/scenery/flag.json'
import * as SCENERY_GRASS from './types/entityConfigs/scenery/grass.json'
import * as SCENERY_ISO_GRASS from './types/entityConfigs/scenery/isoGrass.json'
import * as SCENERY_MOUNTAIN from './types/entityConfigs/scenery/mountain.json'
import * as SCENERY_PATH from './types/entityConfigs/scenery/path.json'
import * as SCENERY_PLANE from './types/entityConfigs/scenery/plane.json'
import * as SCENERY_POND from './types/entityConfigs/scenery/pond.json'
import * as SCENERY_PYRAMID from './types/entityConfigs/scenery/pyramid.json'
import * as SCENERY_SUBSHRUB from './types/entityConfigs/scenery/subshrub.json'
import * as SCENERY_TREE from './types/entityConfigs/scenery/tree.json'
import * as UI_BUTTON from './types/button/button.json'
import * as UI_CHECKBOX from './types/checkbox/checkbox.json'
import * as UI_CURSOR from './types/cursor/cursor.json'
import * as UI_DATE_VERSION_HASH from './types/dateVersionHash/dateVersionHash.json'
import * as UI_DESTINATION_MARKER from './types/destinationMarker/destinationMarker.json'
import * as UI_ENTITY_PICKER from './types/entityPicker/entityPicker.json'
import * as UI_LEVEL_EDITOR_PANEL from './types/levelEditorPanel/levelEditorPanel.json'
import * as UI_MARQUEE from './types/marquee/marquee.json'
import * as UI_RADIO_BUTTON_GROUP from './types/entityConfigs/ui/radioCheckboxGroup.json'
import * as UI_TEXT from './types/text/text.json'
import * as UI_TOOLBAR from './types/entityConfigs/ui/toolbar.json'
import {EntityType} from '../entity/EntityType'
import {EntityStateParser} from '../entity/EntityStateParser'
import {EntityConfig} from '../entity/EntityParser'
import {Entity} from '../entity/Entity'

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
  [EntityType.UI_MARQUEE]: UI_MARQUEE,
  [EntityType.UI_RADIO_CHECKBOX_GROUP]: UI_RADIO_BUTTON_GROUP,
  [EntityType.UI_TEXT]: UI_TEXT,
  [EntityType.UI_TOOLBAR]: UI_TOOLBAR
})

export function defaultTypeState(type: EntityType): Entity.State | string {
  const config = TypeConfigMap[type]
  return EntityStateParser.parse(
    config.machine ? config.machine.state : undefined
  )
}
