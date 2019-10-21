import {Atlas} from 'aseprite-atlas'
import {AtlasIDParser} from '../atlas/AtlasIDParser'
import {CollisionPredicateParser} from '../collision/CollisionPredicateParser'
import {CollisionTypeParser} from '../collision/CollisionTypeParser'
import {Entity} from './Entity'
import {EntityConfig} from './EntityConfig'
import {EntityFactory} from './EntityFactory'
import {EntityID} from './EntityID'
import {EntityIDParser} from './EntityIDParser'
import {EntityType} from '../entity/EntityType'
import {EntityTypeParser} from './EntityTypeParser'
import {GroupParser} from '../entities/group/GroupParser'
import {LevelLinkParser} from '../entities/levelLink/LevelLinkParser'
import {RectParser} from '../math/RectParser'
import {SpriteParser} from '../sprite/SpriteParser'
import {SpriteStateMachineParser} from '../spriteStateMachine/SpriteStateMachineParser'
import {TextParser} from '../entities/text/TextParser'
import {UpdatePredicateParser} from '../updaters/UpdatePredicateParser'
import {XYParser} from '../math/XYParser'

export type EntityIDConfig = Maybe<EntityID | string>
export type EntityTypeConfig = EntityType | string
export type VariantConfig = Maybe<string>
export type EntityStateConfig = Maybe<Entity.BaseState | string>

export namespace EntityParser {
  export function parseAll(
    atlas: Atlas,
    config: Maybe<readonly EntityConfig[]>
  ): Entity[] {
    return (config ?? []).map(entityConfig => parse(entityConfig, atlas))
  }

  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    let props = parseProps(atlas, config, EntityTypeParser.parse(config.type))
    props = parseTypeProps(config, props)
    return EntityFactory.produce(atlas, props)
  }

  export function parseVariant(config: VariantConfig): Maybe<string> {
    // Variant is validated in the Entity constructor.
    return config
  }

  export function parseState(
    config: EntityStateConfig
  ): Entity.BaseState | string {
    // State is validated in the Entity constructor.
    return config || Entity.BaseState.HIDDEN
  }
}

function parseProps(
  atlas: Atlas,
  config: EntityConfig,
  type: EntityType
): Entity.Props | Entity.SubProps {
  const props: Writable<Entity.Props | Entity.SubProps> = {type}
  if (config.id !== undefined) props.id = EntityIDParser.parse(config.id)
  if (config.variant !== undefined) props.variant = config.variant
  if (config.position !== undefined)
    props.position = XYParser.parse(config.position)
  if (config.x !== undefined) props.x = config.x
  if (config.y !== undefined) props.y = config.y
  if (config.scale !== undefined)
    props.scale = SpriteParser.parseScale(config.scale)
  if (config.sx !== undefined) props.sx = config.sx
  if (config.sy !== undefined) props.sy = config.sy
  if (config.vx !== undefined) props.vx = config.vx
  if (config.vy !== undefined) props.vy = config.vy
  if (config.velocity !== undefined)
    props.velocity = XYParser.parse(config.velocity)
  if (config.constituentID !== undefined)
    props.constituentID = AtlasIDParser.parse(config.constituentID)
  if (config.state !== undefined) props.state = config.state
  if (config.map !== undefined)
    props.map = SpriteStateMachineParser.parseMap(atlas, config.map)
  if (config.updatePredicate !== undefined)
    props.updatePredicate = UpdatePredicateParser.parse(config.updatePredicate)
  if (config.collisionType !== undefined)
    props.collisionType = CollisionTypeParser.parse(config.collisionType)
  if (config.collisionPredicate !== undefined)
    props.collisionPredicate = CollisionPredicateParser.parse(
      config.collisionPredicate
    )
  if (config.collisionBodies !== undefined)
    props.collisionBodies = RectParser.parseAll(config.collisionBodies)
  if (config.children !== undefined)
    props.children = EntityParser.parseAll(atlas, config.children)
  return props
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
