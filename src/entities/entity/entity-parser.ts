import * as CHAR_BACKPACKER from '../types/backpacker/backpacker.json'
import * as CHAR_BEE from '../types/entity-configs/char/bee.json'
import * as CHAR_BUNNY from '../types/entity-configs/char/bunny.json'
import * as CHAR_FLY from '../types/entity-configs/char/fly.json'
import * as CHAR_FROG from '../types/entity-configs/char/frog.json'
import * as CHAR_SNAKE from '../types/entity-configs/char/snake.json'
import * as GROUP from '../types/entity-configs/group.json'
import * as IMAGE_ENTITY from '../types/image-entity/image-entity.json'
import * as SCENERY_BUSH from '../types/entity-configs/scenery/bush.json'
import * as SCENERY_CATTAILS from '../types/entity-configs/scenery/cattails.json'
import * as SCENERY_CLOUD from '../types/entity-configs/scenery/cloud.json'
import * as SCENERY_CLOVER from '../types/entity-configs/scenery/clover.json'
import * as SCENERY_CONIFER from '../types/entity-configs/scenery/conifer.json'
import * as SCENERY_FLAG from '../types/entity-configs/scenery/flag.json'
import * as SCENERY_GRASS from '../types/entity-configs/scenery/grass.json'
import * as SCENERY_ISO_GRASS from '../types/entity-configs/scenery/iso-grass.json'
import * as SCENERY_MOUNTAIN from '../types/entity-configs/scenery/mountain.json'
import * as SCENERY_PATH from '../types/entity-configs/scenery/path.json'
import * as SCENERY_PLANE from '../types/entity-configs/scenery/plane.json'
import * as SCENERY_POND from '../types/entity-configs/scenery/pond.json'
import * as SCENERY_PYRAMID from '../types/entity-configs/scenery/pyramid.json'
import * as SCENERY_SUBSHRUB from '../types/entity-configs/scenery/subshrub.json'
import * as SCENERY_TREE from '../types/entity-configs/scenery/tree.json'
import * as UI_BUTTON from '../types/button/button.json'
import * as UI_CHECKBOX from '../types/checkbox/checkbox.json'
import * as UI_CURSOR from '../types/cursor/cursor.json'
import * as UI_DATE_VERSION_HASH from '../types/date-version-hash/date-version-hash.json'
import * as UI_DESTINATION_MARKER from '../types/destination-marker/destination-marker.json'
import * as UI_ENTITY_PICKER from '../types/entity-picker/entity-picker.json'
import * as UI_LEVEL_EDITOR_PANEL from '../types/level-editor-panel/level-editor-panel.json'
import * as UI_RADIO_BUTTON_GROUP from '../types/entity-configs/ui/radio-checkbox-group.json'
import * as UI_TEXT from '../types/text/text.json'
import * as UI_TOOLBAR from '../types/entity-configs/ui/toolbar.json'
import {Atlas} from '../../atlas/atlas/atlas'
import {CollisionPredicateParser} from '../../collision/collision-predicate/collision-predicate-parser'
import {EntityConfig, EntityArrayConfig} from './entity-config'
import {Entity} from './entity'
import {EntityIDParser} from '../entity-id/entity-id-parser'
import {EntityState} from '../entity-state/entity-state'
import {EntityStateParser} from '../entity-state/entity-state-parser'
import {EntityTypeConfigParserMap} from '../entity-type-config-parser-map'
import {EntityType} from '../entity-type/entity-type'
import {EntityTypeParser} from '../entity-type/entity-type-parser'
import {EntityUtil} from './entity-util'
import {ImageRect} from '../../images/image-rect/image-rect'
import {ImageScaleParser} from '../../images/image-scale/image-scale-parser'
import {ImageStateMapParser} from '../../images/image-state-map/image-state-map-parser'
import {JSONUtil, JSONObject} from '../../utils/json-util/json-util'
import {UpdatePredicateParser} from '../updaters/update-predicate/update-predicate-parser'
import {UpdaterParserMap} from '../updaters/updater-parser-map'
import {XYParser} from '../../math/xy/xy-parser'
import {UpdaterParser} from '../updaters/updater/updater-parser'
import {RectParser} from '../../math/rect/rect-parser'

export namespace EntityParser {
  export function parseAll(config: EntityArrayConfig, atlas: Atlas): Entity[] {
    return (config || []).map(entityConfig => parse(entityConfig, atlas))
  }

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

    const parser = EntityTypeConfigParserMap.map(type)
    entity = parser ? parser(entity, atlas) : entity

    entity.updaters.forEach(updater => {
      const parser = UpdaterParserMap.Parse[updater]
      entity = parser ? parser(entity, atlas) : entity
    })

    return entity
  }

  export function defaultState(type: EntityType): EntityState | string {
    return EntityStateParser.parse(defaultTypeConfigs[type].state)
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
  const defaults = defaultTypeConfigs[type]
  return <EntityConfig>(
    (<unknown>(
      JSONUtil.merge(
        <JSONObject>(<unknown>defaults),
        <JSONObject>(<unknown>config)
      )
    ))
  )
}

const defaultTypeConfigs: Readonly<
  Record<EntityType, EntityConfig>
> = Object.freeze({
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
  [EntityType.UI_RADIO_CHECKBOX_GROUP]: UI_RADIO_BUTTON_GROUP,
  [EntityType.UI_TEXT]: UI_TEXT,
  [EntityType.UI_TOOLBAR]: UI_TOOLBAR
})
