import * as GROUP from '../entities/types/entityConfigs/group.json'
import * as IMAGE_ENTITY from '../entities/types/imageEntity/imageEntity.json'
import * as UI_LEVEL_EDITOR_PANEL from '../entities/types/levelEditorPanel/levelEditorPanel.json'
import * as UI_MARQUEE from '../entities/types/marquee/marquee.json'
import * as UI_RADIO_BUTTON_GROUP from '../entities/types/entityConfigs/ui/radioCheckboxGroup.json'
import {Atlas} from 'aseprite-atlas'
import {AtlasIDConfig, AtlasIDParser} from '../atlas/AtlasIDParser'
import {
  CollisionPredicateConfig,
  CollisionPredicateParser
} from '../collision/CollisionPredicateParser'
import {
  CollisionTypeKeyArrayConfig,
  CollisionTypeParser
} from '../collision/CollisionTypeParser'
import {Entity} from './Entity'
import {EntityID} from './EntityID'
import {EntityType} from './EntityType'
import {FollowCamParser} from '../entities/updaters/types/followCam/FollowCamParser'
import {ImageParser, ImageScaleConfig} from '../image/ImageParser'
import {JSONObject, JSONUtil} from '../utils/JSONUtil'
import {LevelLinkParser} from '../entities/updaters/types/levelLink/LevelLinkParser'
import {ObjectUtil} from '../utils/ObjectUtil'
import {RectArrayConfig, RectParser} from '../math/RectParser'
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
import {
  ImageStateMapConfig,
  ImageStateMapParser
} from '../imageStateMachine/ImageStateMapParser'

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
  readonly state?: EntityStateConfig
  readonly map?: ImageStateMapConfig
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

    const props = parseProps(config, type, atlas)
    let entity = EntityFactory.produce(config, type, props, atlas, parse)
    Object.assign(entity, specialization(config))

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
}

function parseProps(
  config: EntityConfig,
  type: EntityType,
  atlas: Atlas
): Entity.Props {
  return {
    id: EntityParser.parseID(config.id),
    type,
    ...(config.position && {position: XYParser.parse(config.position)}),
    ...(config.scale && {scale: ImageParser.parseScale(config.scale)}),
    ...(config.velocity && {velocity: XYParser.parse(config.velocity)}),
    ...(config.imageID && {imageID: AtlasIDParser.parse(config.imageID)}),
    ...(config.state && {state: EntityParser.parseState(config.state)}),
    ...(config.map && {map: ImageStateMapParser.parse(config.map, atlas)}),
    ...(config.updatePredicate && {
      updatePredicate: UpdatePredicateParser.parse(config.updatePredicate)
    }),
    ...(config.updaters && {
      updaters: UpdaterTypeParser.parseAll(config.updaters)
    }),
    ...(config.collisionTypes && {
      collisionType: CollisionTypeParser.parseKeys(config.collisionTypes)
    }),
    ...(config.collisionPredicate && {
      collisionPredicate: CollisionPredicateParser.parse(
        config.collisionPredicate
      )
    }),
    ...(config.collisionBodies && {
      collisionBodies: RectParser.parseAll(config.collisionBodies)
    }),
    ...(config.children && {
      children: EntityParser.parseAll(config.children, atlas)
    })
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
    imageID,
    state,
    map,
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

const UpdaterParserMap: Readonly<Partial<
  Record<UpdaterType, UpdaterParser>
>> = Object.freeze({
  [UpdaterType.UI_LEVEL_LINK]: LevelLinkParser.parse,
  [UpdaterType.UI_FOLLOW_CAM]: FollowCamParser.parse
})

const TypeConfigMap: Readonly<Partial<
  Record<EntityType, EntityConfig>
>> = Object.freeze({
  [EntityType.GROUP]: GROUP,
  [EntityType.IMAGE]: IMAGE_ENTITY,
  [EntityType.UI_LEVEL_EDITOR_PANEL]: UI_LEVEL_EDITOR_PANEL,
  [EntityType.UI_MARQUEE]: UI_MARQUEE,
  [EntityType.UI_RADIO_CHECKBOX_GROUP]: UI_RADIO_BUTTON_GROUP
})
