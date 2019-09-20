import {EntityTypeConfigParserMap} from '../entity-type-config-parser-map'
import {Atlas} from '../../atlas/atlas/atlas'
import {CollisionPredicateParser} from '../../collision/collision-predicate/collision-predicate-parser'
import {EntityConfig, EntityArrayConfig} from './entity-config'
import {Entity} from './entity'
import {EntityIDParser} from '../entity-id/entity-id-parser'
import {EntityStateParser} from '../entity-state/entity-state-parser'
import {EntityTypeConfigMap} from '../entity-type-config-map/entity-type-config-map'
import {EntityType} from '../entity-type/entity-type'
import {EntityTypeParser} from '../entity-type/entity-type-parser'
import {ImageRect} from '../../images/image-rect/image-rect'
import {ImageScaleParser} from '../../images/image-scale/image-scale-parser'
import {ImageStateMapParser} from '../../images/image-state-map/image-state-map-parser'
import {JSONUtil, JSONObject} from '../../utils/json-util/json-util'
import {RectArrayParser} from '../../math/rect-array/rect-array-parser'
import {UpdatePredicateParser} from '../updaters/update-predicate/update-predicate-parser'
import {UpdaterArrayParser} from '../updaters/updater-array/updater-array-parser'
import {XYParser} from '../../math/xy/xy-parser'
import {UpdaterParserMap} from '../updaters/updater-parser-map'
import {EntityUtil} from './entity-util'

export namespace EntityParser {
  export function parseArray(
    config: EntityArrayConfig,
    atlas: Atlas
  ): Entity[] {
    return (config || []).map(entityConfig =>
      EntityParser.parse(entityConfig, atlas)
    )
  }

  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    const type = EntityTypeParser.parse(config.type)

    config = withDefaults(config, type)

    const state = EntityStateParser.parse(config.state)
    const imageStates = ImageStateMapParser.parse(config.imageStates, atlas)
    const children = parseArray(config.children, atlas)
    const scale = ImageScaleParser.parse(config.scale)
    for (const state of Object.values(imageStates)) {
      ImageRect.scale(state, scale)
    }

    let entity: Entity = {
      ...specialization(config),
      spawnID: Symbol(),
      id: EntityIDParser.parse(config.id),
      type: type,
      // Initialize position to ImageRect origin so that moveBy() is effectively
      // a moveTo().
      bounds: {
        x: 0, //imageStates[state].bounds.x,
        y: 0, //imageStates[state].bounds.y,
        w: 0,
        h: 0
      },
      scale,
      state,
      imageStates,
      updatePredicate: UpdatePredicateParser.parse(config.updatePredicate),
      updaters: UpdaterArrayParser.parse(config.updaters),
      collisionPredicate: CollisionPredicateParser.parse(
        config.collisionPredicate
      ),
      collisionBodies: RectArrayParser.parse(config.collisionBodies),
      children
    }

    // Move the images, collision, and children.
    const position = XYParser.parse(config.position)
    EntityUtil.moveTo(entity, position)

    EntityUtil.setScale(entity, entity.scale)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children.
    EntityUtil.invalidateBounds(entity)

    const parser = EntityTypeConfigParserMap.map(type)
    entity = parser ? parser(entity, atlas) : entity

    entity.updaters.forEach(updater => {
      const parser = UpdaterParserMap.Parse[updater]
      entity = parser ? parser(entity, atlas) : entity
    })

    return entity
  }
}

function withDefaults(config: EntityConfig, type: EntityType): EntityConfig {
  return <EntityConfig>(
    (<unknown>(
      JSONUtil.merge(
        <JSONObject>(<unknown>EntityTypeConfigMap[type]),
        <JSONObject>(<unknown>config)
      )
    ))
  )
}

function specialization(config: EntityConfig): Partial<EntityConfig> {
  const {
    id,
    type,
    position,
    scale,
    state,
    imageStates,
    updatePredicate,
    updaters,
    collisionPredicate,
    collisionBodies,
    children,
    ...specialization
  } = config
  return specialization
}
