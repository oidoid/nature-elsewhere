import {Atlas} from '../../atlas/atlas/Atlas'
import {CheckboxParser} from '../types/checkbox/CheckboxParser'
import {CollisionPredicateParser} from '../../collision/collisionPredicate/CollisionPredicateParser'
import {DateVersionHashParser} from '../types/dateVersionHash/DateVersionHashParser'
import {EntityConfig, EntityArrayConfig} from './EntityConfig'
import {Entity} from './Entity'
import {EntityIDParser} from '../entityID/EntityIDParser'
import {EntityPickerParser} from '../types/entityPicker/EntityPickerParser'
import {EntityType} from '../entityType/EntityType'
import {RecursiveEntityParser} from '../RecursiveEntityParser'
import {EntityTypeParser} from '../entityType/EntityTypeParser'
import {EntityUtil} from './EntityUtil'
import {ImageEntityParser} from '../types/imageEntity/ImageEntityParser'
import {ImageRect} from '../../images/imageRect/ImageRect'
import {ImageScaleParser} from '../../images/imageScale/ImageScaleParser'
import {ImageStateMachineParser} from '../../images/imageStateMachine/ImageStateMachineParser'
import {JSONUtil, JSONObject} from '../../utils/jsonUtil/JSONUtil'
import {LevelEditorPanelParser} from '../types/levelEditorPanel/LevelEditorPanelParser'
import {RectParser} from '../../math/rect/RectParser'
import {TextParser} from '../types/text/TextParser'
import {UpdatePredicateParser} from '../updaters/updatePredicate/UpdatePredicateParser'
import {XYParser} from '../../math/xy/XYParser'
import {TypeConfigMap} from '../TypeConfigMap'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {UpdaterTypeParser} from '../updaters/updaterType/UpdaterTypeParser'
import {UpdaterParser} from '../updaters/UpdaterParser'
import {FollowCamParser} from '../types/followCam/FollowCamParser'
import {LevelLinkParser} from '../types/levelLink/LevelLinkParser'

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

    const machine = ImageStateMachineParser.parse(config.machine, atlas)
    const children = parseAll(config.children, atlas)
    const scale = ImageScaleParser.parse(config.scale)
    for (const state of Object.values(machine.map))
      ImageRect.scale(state, scale)

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
    EntityUtil.moveTo(entity, position)

    EntityUtil.setScale(entity, scale)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children.
    EntityUtil.invalidateBounds(entity)

    const parser = TypeParserMap[type]
    entity = parser ? parser(entity, atlas, parse) : entity

    entity.updaters.forEach(updater => {
      const parser = UpdaterParserMap[updater]
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
