import {EntityConfig} from './entity-config'
import {Entity} from '../entity'
import {EntityStateParser} from './entity-state-parser'
import {ImageStateMapParser} from '../../images/parsers/image-state-map-parser'
import {RectArrayParser} from '../../math/parsers/rect-array-parser'
import {UpdatePredicateParser} from '../updaters/parsers/update-predicate-parser'
import {UpdaterArrayParser} from '../updaters/parsers/updater-array-parser'
import {EntityIDParser} from './entity-id-parser'
import {CollisionPredicateParser} from '../colliders/collision-predicate-parser'
import {EntityArrayParser} from './entity-array-parser'
import {EntityTypeParser} from './entity-type-parser'
import {XYParser} from '../../math/parsers/xy-parser'
import {ImageScaleParser} from '../../images/parsers/image-scale-parser'
import {Atlas} from '../../atlas/atlas'
import {EntityTypeConfigMap} from '../types/entity-type-config-map'
import {JSONUtil, JSONObject} from '../../utils/json-util'
import {EntityType} from '../types/entity-type'
import {EntityTypeConfigParserMap} from '../types/parsers/entity-type-config-parser-map'
import {Updater} from '../updaters/updater'
import {ImageRect} from '../../images/image-rect'

export namespace EntityParser {
  export function parse(config: EntityConfig, atlas: Atlas): Entity {
    const type = EntityTypeParser.parse(config.type)

    config = withDefaults(config, type)

    const state = EntityStateParser.parse(config.state)
    const imageStates = ImageStateMapParser.parse(config.imageStates, atlas)
    const children = EntityArrayParser.parse(config.children, atlas)
    const scaleImages = ImageScaleParser.parse(config.scaleImages)
    for (const state of Object.values(imageStates)) {
      ImageRect.scale(state, scaleImages)
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
      flipImages: ImageScaleParser.parse(config.flipImages),
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
    flipImages,
    scaleImages,
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
