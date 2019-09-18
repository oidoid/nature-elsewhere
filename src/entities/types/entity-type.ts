import {Entity} from '../entity'

/** Identifier for distinguishing among entity classes and tracing configuration
    selection. */
export enum EntityType {
  GROUP = 'group',
  CHAR_BACKPACKER = 'charBackpacker',
  CHAR_BEE = 'charBee',
  CHAR_BUNNY = 'charBunny',
  CHAR_FLY = 'charFly',
  CHAR_FROG = 'charFrog',
  CHAR_SNAKE = 'charSnake',
  SCENERY_BUSH = 'sceneryBush',
  SCENERY_CATTAILS = 'sceneryCattails',
  SCENERY_CLOUD = 'sceneryCloud',
  SCENERY_CLOVER = 'sceneryClover',
  SCENERY_CONIFER = 'sceneryConifer',
  SCENERY_FLAG = 'sceneryFlag',
  SCENERY_GRASS = 'sceneryGrass',
  SCENERY_ISO_GRASS = 'sceneryIsoGrass',
  SCENERY_MOUNTAIN = 'sceneryMountain',
  SCENERY_PATH = 'sceneryPath',
  SCENERY_PLANE = 'sceneryPlane',
  SCENERY_POND = 'sceneryPond',
  SCENERY_PYRAMID = 'sceneryPyramid',
  SCENERY_SUBSHRUB = 'scenerySubshrub',
  SCENERY_TREE = 'sceneryTree',
  UI_BUTTON = 'uiButton',
  UI_CURSOR = 'uiCursor',
  UI_DATE_VERSION_HASH = 'uiDateVersionHash',
  UI_DESTINATION_MARKER = 'uiDestinationMarker', // maybe not
  UI_LEVEL_EDITOR_PANEL = 'uiLevelEditorPanel',
  UI_ENTITY_PICKER = 'uiEntityPicker',
  UI_TEXT = 'uiText',
  UI_RADIO_CHECKBOX_GROUP = 'uiRadioCheckboxGroup',
  UI_CHECKBOX = 'uiCheckbox',
  UI_TOOLBAR = 'uiToolbar',
  UI_TINY_BACKPACKER = 'uiTinyBackpacker'
}

export namespace EntityType {
  export function is<T extends Entity>(
    entity: Entity,
    type: T['type']
  ): entity is T {
    return entity.type === type
  }

  export function assert<T extends Entity>(
    entity: Entity,
    type: T['type']
  ): entity is T {
    const msg = `Unexpected entity type "${entity.type}". Expected "${type}".`
    if (!is(entity, type)) throw new Error(msg)
    return true
  }
}
