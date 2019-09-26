import {Atlas} from '../../atlas/atlas/Atlas'
import {AtlasIDParser, AtlasIDConfig} from '../../atlas/atlasID/AtlasIDParser'
import {CheckboxParser} from '../types/checkbox/CheckboxParser'
import {
  CollisionPredicateConfig,
  CollisionPredicateParser
} from '../../collision/CollisionPredicateParser'
import {DateVersionHashParser} from '../types/dateVersionHash/DateVersionHashParser'
import {Entity} from './Entity'
import {EntityPickerParser} from '../types/entityPicker/EntityPickerParser'
import {EntityType} from './EntityType'
import {EntityTypeParser, EntityTypeConfig} from './EntityTypeParser'
import {FollowCamParser} from '../updaters/types/followCam/FollowCamParser'
import {ImageEntityParser} from '../types/imageEntity/ImageEntityParser'
import {ImageRect} from '../../images/imageRect/ImageRect'
import {ImageScaleConfig, ImageScaleParser} from '../../images/ImageScaleParser'
import {
  ImageStateMachineParser,
  ImageStateMachineConfig
} from '../../images/imageStateMachine/ImageStateMachineParser'
import {JSONUtil, JSONObject} from '../../utils/jsonUtil/JSONUtil'
import {LevelEditorPanelParser} from '../types/levelEditorPanel/LevelEditorPanelParser'
import {LevelLinkParser} from '../updaters/types/levelLink/LevelLinkParser'
import {RectParser, RectArrayConfig} from '../../math/rect/RectParser'
import {RecursiveEntityParser} from '../RecursiveEntityParser'
import {TextParser} from '../types/text/TextParser'
import {TypeConfigMap} from '../TypeConfigMap'
import {
  UpdatePredicateParser,
  UpdatePredicateConfig
} from '../updaters/updatePredicate/UpdatePredicateParser'
import {UpdaterParser} from '../updaters/UpdaterParser'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {
  UpdaterTypeParser,
  UpdaterTypeArrayConfig
} from '../updaters/updaterType/UpdaterTypeParser'
import {XYParser, XYConfig} from '../../math/xy/XYParser'
import {EntityIDConfig, EntityIDParser} from './EntityIDParser'

export type EntityArrayConfig = Maybe<readonly EntityConfig[]>

export interface EntityConfig {
  /** Defaults to EntityID.UNDEFINED. */
  readonly id?: EntityIDConfig
  readonly type: EntityTypeConfig
  /** Defaults to (0, 0). */
  readonly position?: XYConfig
  readonly imageID?: AtlasIDConfig
  readonly scale?: ImageScaleConfig
  /** Defaults to {}. */
  readonly machine?: ImageStateMachineConfig
  /** Defaults to BehaviorPredicate.NEVER. */
  readonly updatePredicate?: UpdatePredicateConfig
  /** Defaults to []. */
  readonly updaters?: UpdaterTypeArrayConfig
  /** Defaults to CollisionPredicate.NEVER. */
  readonly collisionPredicate?: CollisionPredicateConfig
  /** Defaults to []. */
  readonly collisionBodies?: RectArrayConfig
  /** Defaults to []. */
  readonly children?: EntityArrayConfig
}

export namespace EntityParser {
  export function parseAll(config: EntityArrayConfig, atlas: Atlas): Entity[] {
    return (config || []).map(entityConfig => parse(entityConfig, atlas))
  }

  /** A recursive parser. Beware that invoking this function directly from
      within an EntityTypeParser will create an import loop. Use the function
      passed as the RecursiveEntityParser parameter. */
  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    const type = EntityTypeParser.parse(config.type)

    config = withDefaults(config, type)

    const imageID = config.imageID
      ? AtlasIDParser.parse(config.imageID)
      : undefined
    const machine = ImageStateMachineParser.parse(config.machine, atlas)
    const children = parseAll(config.children, atlas)
    const scale = ImageScaleParser.parse(config.scale)
    for (const rect of Object.values(machine.map)) {
      if (imageID) ImageRect.setImageID(rect, imageID)
    }

    let entity: Entity = {
      ...specialization(config),
      spawnID: Symbol(),
      id: EntityIDParser.parse(config.id),
      type: type,
      bounds: {position: {x: 0, y: 0}, size: {w: 0, h: 0}},
      machine,
      updatePredicate: UpdatePredicateParser.parse(config.updatePredicate),
      updaters: UpdaterTypeParser.parseAll(config.updaters),
      collisionPredicate: CollisionPredicateParser.parse(
        config.collisionPredicate
      ),
      collisionBodies: RectParser.parseAll(config.collisionBodies),
      children
    }

    // Move the images, collision, and children.
    const position = XYParser.parse(config.position)
    Entity.moveTo(entity, position)

    Entity.setScale(entity, scale)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children.
    Entity.invalidateBounds(entity)

    const parser = TypeParserMap[type]
    entity = parser ? parser(entity, atlas, parse) : entity

    for (const updater of entity.updaters) {
      const parser = UpdaterParserMap[updater]
      entity = parser ? parser(entity, atlas, parse) : entity
    }

    return entity
  }
}

function specialization(config: EntityConfig): Partial<EntityConfig> {
  // Remove known parsed properties.
  const {
    id,
    type,
    position,
    scale,
    machine,
    updatePredicate,
    updaters,
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

const TypeParserMap: Readonly<
  Partial<Record<EntityType, RecursiveEntityParser>>
> = Object.freeze({
  [EntityType.IMAGE]: ImageEntityParser.parse,
  [EntityType.UI_DATE_VERSION_HASH]: DateVersionHashParser.parse,
  [EntityType.UI_CHECKBOX]: CheckboxParser.parse,
  [EntityType.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanelParser.parse,
  [EntityType.UI_ENTITY_PICKER]: EntityPickerParser.parse,
  [EntityType.UI_TEXT]: TextParser.parse
})

const UpdaterParserMap: Readonly<
  Partial<Record<UpdaterType, UpdaterParser>>
> = Object.freeze({
  [UpdaterType.UI_LEVEL_LINK]: LevelLinkParser.parse,
  [UpdaterType.UI_FOLLOW_CAM]: FollowCamParser.parse
})
