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
import {DecamillipixelIntXYConfig} from '../math/DecamillipixelXYParser'
import {Entity} from './Entity'
import {EntityID} from './EntityID'
import {EntityFactory} from './EntityFactory'
import {EntityType} from './EntityType'
import {FollowCamParser} from '../updaters/followCam/FollowCamParser'
import {ImageParser, ImageScaleConfig} from '../image/ImageParser'
import {
  ImageStateMapConfig,
  ImageStateMapParser
} from '../imageStateMachine/ImageStateMapParser'
import {LevelLinkParser} from '../updaters/levelLink/LevelLinkParser'
import {ObjectUtil} from '../utils/ObjectUtil'
import {RectArrayConfig, RectParser} from '../math/RectParser'
import {TextPropsParser} from '../entities/text/TextParser'
import {
  UpdatePredicateConfig,
  UpdatePredicateParser
} from '../updaters/updatePredicate/UpdatePredicateParser'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {
  UpdaterTypeArrayConfig,
  UpdaterTypeParser
} from '../updaters/updaterType/UpdaterTypeParser'
import {XYConfig, XYParser} from '../math/XYParser'

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

  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    let props = parseProps(config, parseType(config.type), atlas)
    props = parseTypeProps(config, props)
    const entity = EntityFactory.produce(atlas, props)
    parseUpdaterProps(config, entity)
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
    ...(config.id && {id: EntityParser.parseID(config.id)}),
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

function parseTypeProps(
  config: EntityConfig,
  props: Entity.Props
): Entity.Props {
  switch (props.type) {
    case EntityType.UI_TEXT:
    case EntityType.UI_CHECKBOX:
      return TextPropsParser.parse(props, config)
  }
  return props
}

function parseUpdaterProps(config: EntityConfig, entity: Entity): void {
  for (const updater of config.updaters || []) {
    switch (updater) {
      case UpdaterType.UI_LEVEL_LINK:
        Object.assign(entity, LevelLinkParser.parse(config))
        break
      case UpdaterType.UI_FOLLOW_CAM:
        Object.assign(entity, FollowCamParser.parse(config))
        break
    }
  }
}
