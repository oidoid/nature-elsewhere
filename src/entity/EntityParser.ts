import {Atlas} from 'aseprite-atlas'
import {AtlasIDConfig, AtlasIDParser} from '../atlas/AtlasIDParser'
import {
  CollisionPredicateConfig,
  CollisionPredicateParser
} from '../collision/CollisionPredicateParser'
import {
  CollisionTypeConfig,
  CollisionTypeParser
} from '../collision/CollisionTypeParser'
import {Entity} from './Entity'
import {EntityID} from './EntityID'
import {EntityFactory} from './EntityFactory'
import {EntityType} from './EntityType'
import {ImageParser, ImageScaleConfig} from '../image/ImageParser'
import {
  ImageStateMapConfig,
  ImageStateMachineParser
} from '../imageStateMachine/ImageStateMachineParser'
import {LevelLinkParser} from '../entities/levelLink/LevelLinkParser'
import {ObjectUtil} from '../utils/ObjectUtil'
import {RectArrayConfig, RectParser} from '../math/RectParser'
import {GroupParser} from '../entities/group/GroupParser'
import {TextParser} from '../entities/text/TextParser'
import {
  UpdatePredicateConfig,
  UpdatePredicateParser
} from '../updaters/updatePredicate/UpdatePredicateParser'
import {XYConfig, XYParser} from '../math/XYParser'

export type EntityArrayConfig = Maybe<readonly EntityConfig[]>

export interface EntityConfig {
  /** Defaults to EntityID.UNDEFINED. */
  readonly id?: EntityIDConfig
  readonly type: EntityTypeConfig
  readonly variant?: VariantConfig
  /** Defaults to (0, 0). */
  readonly position?: XYConfig
  readonly velocity?: XYConfig // Decamillipixel
  readonly imageID?: AtlasIDConfig
  readonly scale?: ImageScaleConfig
  /** Defaults to {}. */
  readonly state?: EntityStateConfig
  readonly map?: ImageStateMapConfig
  /** Defaults to BehaviorPredicate.NEVER. */
  readonly updatePredicate?: UpdatePredicateConfig
  /** Defaults to CollisionPredicate.NEVER. */
  readonly collisionType?: CollisionTypeConfig
  readonly collisionPredicate?: CollisionPredicateConfig
  /** Defaults to []. In local coordinates (converted to level by parser). */
  readonly collisionBodies?: RectArrayConfig
  /** Defaults to []. */
  readonly children?: EntityArrayConfig
}

export type EntityIDConfig = Maybe<EntityID | string>
export type EntityTypeConfig = EntityType | string
export type VariantConfig = Maybe<string>
export type EntityStateConfig = Maybe<Entity.BaseState | string>

export namespace EntityParser {
  export function parseAll(config: EntityArrayConfig, atlas: Atlas): Entity[] {
    return (config || []).map(entityConfig => parse(entityConfig, atlas))
  }

  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    let props = parseProps(config, parseType(config.type), atlas)
    props = parseTypeProps(config, props)
    return EntityFactory.produce(atlas, props)
  }

  export function parseID(config: EntityIDConfig): EntityID {
    const id = config || EntityID.ANONYMOUS
    ObjectUtil.assertValueOf(EntityID, id, 'EntityID')
    return id
  }

  export function parseType(config: EntityTypeConfig): EntityType {
    ObjectUtil.assertValueOf(EntityType, config, 'EntityType')
    return config
  }

  export function parseVariant(config: VariantConfig): Maybe<string> {
    return config
  }

  export function parseState(
    config: EntityStateConfig
  ): Entity.BaseState | string {
    return config || Entity.BaseState.HIDDEN
  }
}

function parseProps(
  config: EntityConfig,
  type: EntityType,
  atlas: Atlas
): Entity.Props | Entity.SubProps {
  return {
    ...(config.id && {id: EntityParser.parseID(config.id)}),
    type,
    ...(config.variant && {variant: EntityParser.parseVariant(config.variant)}),
    ...(config.position && {position: XYParser.parse(config.position)}),
    ...(config.scale && {scale: ImageParser.parseScale(config.scale)}),
    ...(config.velocity && {velocity: XYParser.parse(config.velocity)}),
    ...(config.imageID && {imageID: AtlasIDParser.parse(config.imageID)}),
    ...(config.state && {state: EntityParser.parseState(config.state)}),
    ...(config.map && {
      map: ImageStateMachineParser.parseMap(config.map, atlas)
    }),
    ...(config.updatePredicate !== undefined && {
      updatePredicate: UpdatePredicateParser.parse(config.updatePredicate)
    }),
    ...(config.collisionType !== undefined && {
      collisionType: CollisionTypeParser.parse(config.collisionType)
    }),
    ...(config.collisionPredicate !== undefined && {
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
  props: Entity.Props | Entity.SubProps
): Entity.Props | Entity.SubProps {
  let typeProps: Maybe<Entity.Props | Entity.SubProps> = undefined
  switch (props.type) {
    case EntityType.GROUP:
      typeProps = GroupParser.parseProps(config)
      break
    case EntityType.UI_TEXT:
    case EntityType.UI_CHECKBOX:
      typeProps = TextParser.parseProps(config)
      break
    case EntityType.UI_LEVEL_LINK:
      typeProps = LevelLinkParser.parseProps(config)
      break
  }
  return {...props, ...typeProps}
}
