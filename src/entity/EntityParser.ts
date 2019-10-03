import * as CHAR_BACKPACKER from '../entities/types/backpacker/backpacker.json'
import * as CHAR_BEE from '../entities/types/entityConfigs/char/bee.json'
import * as CHAR_BUNNY from '../entities/types/entityConfigs/char/bunny.json'
import * as CHAR_FLY from '../entities/types/entityConfigs/char/fly.json'
import * as CHAR_FROG from '../entities/types/entityConfigs/char/frog.json'
import * as CHAR_SNAKE from '../entities/types/entityConfigs/char/snake.json'
import * as GROUP from '../entities/types/entityConfigs/group.json'
import * as IMAGE_ENTITY from '../entities/types/imageEntity/imageEntity.json'
import * as SCENERY_BUSH from '../entities/types/entityConfigs/scenery/bush.json'
import * as SCENERY_CATTAILS from '../entities/types/entityConfigs/scenery/cattails.json'
import * as SCENERY_CLOUD from '../entities/types/entityConfigs/scenery/cloud.json'
import * as SCENERY_CLOVER from '../entities/types/entityConfigs/scenery/clover.json'
import * as SCENERY_CONIFER from '../entities/types/entityConfigs/scenery/conifer.json'
import * as SCENERY_FLAG from '../entities/types/entityConfigs/scenery/flag.json'
import * as SCENERY_GRASS from '../entities/types/entityConfigs/scenery/grass.json'
import * as SCENERY_ISO_GRASS from '../entities/types/entityConfigs/scenery/isoGrass.json'
import * as SCENERY_MOUNTAIN from '../entities/types/entityConfigs/scenery/mountain.json'
import * as SCENERY_PATH from '../entities/types/entityConfigs/scenery/path.json'
import * as SCENERY_PLANE from '../entities/types/entityConfigs/scenery/plane.json'
import * as SCENERY_POND from '../entities/types/entityConfigs/scenery/pond.json'
import * as SCENERY_PYRAMID from '../entities/types/entityConfigs/scenery/pyramid.json'
import * as SCENERY_SUBSHRUB from '../entities/types/entityConfigs/scenery/subshrub.json'
import * as SCENERY_TREE from '../entities/types/entityConfigs/scenery/tree.json'
import * as UI_BUTTON from '../entities/types/button/button.json'
import * as UI_CHECKBOX from '../entities/types/checkbox/checkbox.json'
import * as UI_CURSOR from '../entities/types/cursor/cursor.json'
import * as UI_DATE_VERSION_HASH from '../entities/types/dateVersionHash/dateVersionHash.json'
import * as UI_DESTINATION_MARKER from '../entities/types/destinationMarker/destinationMarker.json'
import * as UI_ENTITY_PICKER from '../entities/types/entityPicker/entityPicker.json'
import * as UI_LEVEL_EDITOR_PANEL from '../entities/types/levelEditorPanel/levelEditorPanel.json'
import * as UI_MARQUEE from '../entities/types/marquee/marquee.json'
import * as UI_RADIO_BUTTON_GROUP from '../entities/types/entityConfigs/ui/radioCheckboxGroup.json'
import * as UI_TEXT from '../entities/types/text/text.json'
import * as UI_TOOLBAR from '../entities/types/entityConfigs/ui/toolbar.json'
import {Atlas} from 'aseprite-atlas'
import {AtlasIDConfig, AtlasIDParser} from '../atlas/AtlasIDParser'
import {CheckboxParser} from '../entities/types/checkbox/CheckboxParser'
import {
  CollisionPredicateConfig,
  CollisionPredicateParser
} from '../collision/CollisionPredicateParser'
import {
  CollisionTypeKeyArrayConfig,
  CollisionTypeParser
} from '../collision/CollisionTypeParser'
import {DateVersionHashParser} from '../entities/types/dateVersionHash/DateVersionHashParser'
import {Entity} from './Entity'
import {EntityID} from './EntityID'
import {EntityPickerParser} from '../entities/types/entityPicker/EntityPickerParser'
import {EntityType} from './EntityType'
import {FollowCamParser} from '../entities/updaters/types/followCam/FollowCamParser'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {ImageParser, ImageScaleConfig} from '../image/ImageParser'
import {
  ImageStateMachineConfig,
  ImageStateMachineParser
} from '../imageStateMachine/ImageStateMachineParser'
import {JSONObject, JSONUtil} from '../utils/JSONUtil'
import {LevelEditorPanelParser} from '../entities/types/levelEditorPanel/LevelEditorPanelParser'
import {LevelLinkParser} from '../entities/updaters/types/levelLink/LevelLinkParser'
import {ObjectUtil} from '../utils/ObjectUtil'
import {RectArrayConfig, RectParser} from '../math/RectParser'
import {RecursiveEntityParser} from '../entities/RecursiveEntityParser'
import {TextParser} from '../entities/types/text/TextParser'
import {
  UpdatePredicateConfig,
  UpdatePredicateParser
} from '../entities/updaters/updatePredicate/UpdatePredicateParser'
import {UpdaterParser} from '../entities/updaters/UpdaterParser'
import {
  UpdaterTypeArrayConfig,
  UpdaterTypeParser
} from '../entities/updaters/updaterType/UpdaterTypeParser'
import {UpdaterType} from '../entities/updaters/updaterType/UpdaterType'
import {XYConfig, XYParser} from '../math/XYParser'
import {DecamillipixelIntXYConfig} from '../math/DecamillipixelXYParser'
import {EntityFactory} from './EntityFactory'

export type EntityArrayConfig = Maybe<readonly EntityConfig[]>

export interface EntityConfig {
  /** Defaults to EntityID.UNDEFINED. */
  readonly id?: EntityIDConfig
  readonly type: EntityTypeConfig
  /** Defaults to (0, 0). */
  readonly position?: XYConfig
  readonly velocity?: DecamillipixelIntXYConfig
  readonly imageID?: AtlasIDConfig
  readonly scale?: ImageScaleConfig
  /** Defaults to {}. */
  readonly machine?: ImageStateMachineConfig
  /** Defaults to BehaviorPredicate.NEVER. */
  readonly updatePredicate?: UpdatePredicateConfig
  /** Defaults to []. */
  readonly updaters?: UpdaterTypeArrayConfig
  /** Defaults to CollisionPredicate.NEVER. */
  readonly collisionTypes?: CollisionTypeKeyArrayConfig
  readonly collisionPredicate?: CollisionPredicateConfig
  /** Defaults to []. In local coordinates (converted to level by parser). */
  readonly collisionBodies?: RectArrayConfig
  /** Defaults to []. */
  readonly children?: EntityArrayConfig
}

export type EntityIDConfig = Maybe<EntityID | string>
export type EntityTypeConfig = EntityType | string
export type EntityStateConfig = Maybe<Entity.State | string>

export namespace EntityParser {
  export function parseAll(config: EntityArrayConfig, atlas: Atlas): Entity[] {
    return (config || []).map(entityConfig => parse(entityConfig, atlas))
  }

  /** A recursive parser. Beware that invoking this function directly from
      within an EntityTypeParser will create an import loop. Use the function
      passed as the RecursiveEntityParser parameter. */
  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    const type = parseType(config.type)

    config = withDefaults(config, type)

    const imageID = config.imageID
      ? AtlasIDParser.parse(config.imageID)
      : undefined
    const machine = ImageStateMachineParser.parse(config.machine, atlas)
    const children = parseAll(config.children, atlas)
    const scale = ImageParser.parseScale(config.scale)
    for (const rect of Object.values(machine.map)) {
      if (imageID) ImageRect.setImageID(rect, imageID)
    }

    const props = {
      id: parseID(config.id),
      type: type,
      velocity: XYParser.parse(config.velocity),
      machine,
      updatePredicate: UpdatePredicateParser.parse(config.updatePredicate),
      updaters: UpdaterTypeParser.parseAll(config.updaters),
      collisionType: CollisionTypeParser.parseKeys(config.collisionTypes),
      collisionPredicate: CollisionPredicateParser.parse(
        config.collisionPredicate
      ),
      collisionBodies: RectParser.parseAll(config.collisionBodies),
      children
    }
    let entity: Entity = EntityFactory.produce(config, type, props, atlas)
    Object.assign(entity, specialization(config))

    // Move the images, collision, and children.
    const position = XYParser.parse(config.position)
    entity.moveTo(position)

    entity.setScale(scale)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children.
    entity.invalidateBounds()

    const parser = TypeParserMap[type]
    entity = parser ? parser(entity, atlas, parse) : entity

    for (const updater of entity.updaters) {
      const parser = UpdaterParserMap[updater]
      entity = parser ? parser(entity, atlas, parse) : entity
    }

    return entity
  }

  export function parseID(config: EntityIDConfig): EntityID {
    const id = config || EntityID.ANONYMOUS
    if (ObjectUtil.assertValueOf(EntityID, id, 'EntityID')) return id
    throw new Error()
  }

  export function parseType(config: EntityTypeConfig): EntityType {
    if (ObjectUtil.assertValueOf(EntityType, config, 'EntityType'))
      return config
    throw new Error()
  }

  export function parseState(config: EntityStateConfig): Entity.State | string {
    return config || Entity.State.HIDDEN
  }

  export function defaultTypeState(type: EntityType): Entity.State | string {
    const config = TypeConfigMap[type]
    return EntityParser.parseState(
      config.machine ? config.machine.state : undefined
    )
  }
}

function specialization(config: EntityConfig) {
  // Remove known parsed properties.
  const {
    id,
    type,
    velocity,
    position,
    scale,
    machine,
    updatePredicate,
    updaters,
    collisionTypes,
    collisionPredicate,
    collisionBodies,
    children,
    ...specialization
  } = config
  return specialization
}

function withDefaults(config: EntityConfig, type: EntityType): EntityConfig {
  return <EntityConfig>(
    (<unknown>(
      JSONUtil.merge(
        <JSONObject>(<unknown>TypeConfigMap[type]),
        <JSONObject>(<unknown>config)
      )
    ))
  )
}

const TypeParserMap: Readonly<Partial<
  Record<EntityType, RecursiveEntityParser>
>> = Object.freeze({
  [EntityType.UI_DATE_VERSION_HASH]: DateVersionHashParser.parse,
  [EntityType.UI_CHECKBOX]: CheckboxParser.parse,
  [EntityType.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanelParser.parse,
  [EntityType.UI_ENTITY_PICKER]: EntityPickerParser.parse,
  [EntityType.UI_TEXT]: TextParser.parse
})

const UpdaterParserMap: Readonly<Partial<
  Record<UpdaterType, UpdaterParser>
>> = Object.freeze({
  [UpdaterType.UI_LEVEL_LINK]: LevelLinkParser.parse,
  [UpdaterType.UI_FOLLOW_CAM]: FollowCamParser.parse
})

const TypeConfigMap: Readonly<Record<EntityType, EntityConfig>> = Object.freeze(
  {
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
  }
)
