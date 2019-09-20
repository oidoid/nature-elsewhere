import {Atlas} from '../../atlas/atlas/atlas'
import {CheckboxParser} from '../types/checkbox/checkbox-parser'
import {CloudParser} from '../types/cloud/cloud-parser'
import {CollisionPredicateParser} from '../../collision/collision-predicate/collision-predicate-parser'
import {DateVersionHashParser} from '../types/date-version-hash/date-version-hash-parser'
import {EntityConfig, EntityArrayConfig} from './entity-config'
import {Entity} from './entity'
import {EntityIDParser} from '../entity-id/entity-id-parser'
import {EntityPickerParser} from '../types/entity-picker/entity-picker-parser'
import {EntityStateParser} from '../entity-state/entity-state-parser'
import {EntityType} from '../entity-type/entity-type'
import {EntityTypeParse} from '../entity-type-parser'
import {EntityTypeParser} from '../entity-type/entity-type-parser'
import {EntityUtil} from './entity-util'
import {ImageEntityParser} from '../types/image-entity/image-entity-parser'
import {ImageRect} from '../../images/image-rect/image-rect'
import {ImageScaleParser} from '../../images/image-scale/image-scale-parser'
import {ImageStateMapParser} from '../../images/image-state-map/image-state-map-parser'
import {JSONUtil, JSONObject} from '../../utils/json-util/json-util'
import {LevelEditorPanelParser} from '../types/level-editor-panel/level-editor-panel-parser'
import {RectParser} from '../../math/rect/rect-parser'
import {TextParser} from '../types/text/text-parser'
import {UpdatePredicateParser} from '../updaters/update-predicate/update-predicate-parser'
import {UpdaterParser} from '../updaters/updater/updater-parser'
import {UpdaterParserMap} from '../updaters/updater-parser-map'
import {XYParser} from '../../math/xy/xy-parser'
import {TypeConfigMap} from '../type-config-map'

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

    const state = EntityStateParser.parse(config.state)
    const imageStates = ImageStateMapParser.parse(config.imageStates, atlas)
    const children = parseAll(config.children, atlas)
    const scale = ImageScaleParser.parse(config.scale)
    for (const state of Object.values(imageStates))
      ImageRect.scale(state, scale)

    let entity: Entity = {
      ...specialization(config),
      spawnID: Symbol(),
      id: EntityIDParser.parse(config.id),
      type: type,
      bounds: {x: 0, y: 0, w: 0, h: 0},
      scale,
      state,
      imageStates,
      updatePredicate: UpdatePredicateParser.parse(config.updatePredicate),
      updaters: UpdaterParser.parseAll(config.updaters),
      collisionPredicate: CollisionPredicateParser.parse(
        config.collisionPredicate
      ),
      collisionBodies: RectParser.parseAll(config.collisionBodies),
      children
    }

    // Move the images, collision, and children.
    const position = XYParser.parse(config.position)
    EntityUtil.moveTo(entity, position)

    EntityUtil.setScale(entity, entity.scale)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children.
    EntityUtil.invalidateBounds(entity)

    const parser = TypeParserMap[type]
    entity = parser ? parser(entity, atlas, parse) : entity

    entity.updaters.forEach(updater => {
      const parser = UpdaterParserMap.Parse[updater]
      entity = parser ? parser(entity, atlas, parse) : entity
    })

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
  Partial<Record<EntityType, EntityTypeParse>>
> = Object.freeze({
  [EntityType.IMAGE]: ImageEntityParser.parse,
  [EntityType.SCENERY_CLOUD]: CloudParser.parse,
  [EntityType.UI_DATE_VERSION_HASH]: DateVersionHashParser.parse,
  [EntityType.UI_CHECKBOX]: CheckboxParser.parse,
  [EntityType.UI_LEVEL_EDITOR_PANEL]: LevelEditorPanelParser.parse,
  [EntityType.UI_ENTITY_PICKER]: EntityPickerParser.parse,
  [EntityType.UI_TEXT]: TextParser.parse
})
