import {EntityConfig} from './entity-config'
import {Entity} from './entity'
import {ImageStateMapParser} from '../../images/image-state-map/image-state-map-parser'
import {RectArrayParser} from '../../math/rect-array/rect-array-parser'
import {UpdatePredicateParser} from '../updaters/update-predicate/update-predicate-parser'
import {UpdaterArrayParser} from '../updaters/updater-array/updater-array-parser'
import {EntityIDParser} from '../entity-id/entity-id-parser'
import {XYParser} from '../../math/xy/xy-parser'
import {ImageScaleParser} from '../../images/image-scale/image-scale-parser'
import {Atlas} from '../../atlas/atlas/atlas'
import {EntityTypeConfigMap} from '../entity-type-config-map/entity-type-config-map'
import {JSONUtil, JSONObject} from '../../utils/json-util/json-util'
import {EntityType} from '../entity-type/entity-type'
import {EntityTypeConfigParserMap} from '../entity-type-config-parser-map'
import {Updater} from '../updaters/updater/updater'
import {ImageRect} from '../../images/image-rect/image-rect'
import {CollisionPredicateParser} from '../../collision/collision-predicate/collision-predicate-parser'
import {EntityTypeParser} from '../entity-type/entity-type-parser'
import {EntityStateParser} from '../entity-state/entity-state-parser'
import {EntityArrayParser} from '../entity-array/entity-array-parser'

export namespace EntityParser {
  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    const type = EntityTypeParser.parse(config.type)

    config = withDefaults(config, type)

    const state = EntityStateParser.parse(config.state)
    const imageStates = ImageStateMapParser.parse(config.imageStates, atlas)
    const children = EntityArrayParser.parse(config.children, atlas)
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
    Entity.moveTo(entity, position)

    Entity.setScale(entity, entity.scale)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children.
    Entity.invalidateBounds(entity)

    const parser = EntityTypeConfigParserMap.map(type)
    entity = parser ? parser(entity, atlas) : entity

    entity.updaters.forEach(updater => {
      const parser = Updater.Parse[updater]
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
