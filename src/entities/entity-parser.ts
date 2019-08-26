import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import * as defaultEntity from '../assets/entities/default.json'
import {Entity} from './entity'
import {EntityConfigs} from './entity-configs'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Text} from '../text/text'
import {UpdateType} from '../store/update-type'
import {TextEntity} from './text-entity'

const imagesFactory: Partial<
  Record<string, (atlas: Atlas, entity: Entity) => Entity>
> = Object.freeze({
  textDateVersionHash: newTextDateVersionHash,
  text: TextEntity.make,
  virtualJoystick: newVirtualJoystick
})

export namespace EntityParser {
  export function parse(atlas: Atlas, cfg: Entity.Config): Entity {
    if (cfg.updateType && !isUpdateTypeKey(cfg.updateType))
      throw new Error(`"${cfg.updateType}" is not a key of UpdateType.`)
    if (cfg.behavior && !isBehaviorKey(cfg.behavior))
      throw new Error(`"${cfg.behavior}" is not a key of Behavior.`)

    const state = ((cfg.id && imagesFactory[cfg.id]) || newStandardEntity)(
      atlas,
      Object.assign({}, <any>defaultEntity, cfg)
    )
    return {...state, ...Image.target(...state.images)}
  }
}

function isUpdateTypeKey(val: string): val is UpdateType.Key {
  return val in UpdateType
}

function isBehaviorKey(val: string): val is UpdateType.Key {
  return val in Behavior
}

function newStandardEntity(atlas: Atlas, entity: Entity): Entity {
  const cfg = EntityConfigs[entity.id] || {}
  const images = (cfg.images || [])
    .concat(entity.images)
    .concat((cfg.states && cfg.states[entity.state || 0]) || [])
    .map(({id, ...cfg}) =>
      Image.make(atlas, {id, sx: entity.sx, sy: entity.sy, ...cfg})
    )
  ImageRect.moveBy(
    {x: 0, y: 0, w: 0, h: 0},
    {x: entity.x, y: entity.y},
    ...images
  )
  return Object.assign({}, entity, cfg, {images})
}

function newTextDateVersionHash(
  atlas: Atlas,
  {x, y, ...entity}: Entity
): Entity {
  const {date, version, hash} = process.env
  const images = Text.toImages(atlas, `${date} v${version} (${hash})`, {x, y})
  return {...entity, updateType: 'ALWAYS', behavior: 'FOLLOW_CAM', x, y, images} // move to defaults
}

function newVirtualJoystick(atlas: Atlas, entity: Entity): Entity {
  entity = newStandardEntity(atlas, entity)
  ;(<any>entity).stick = entity.images.find(
    ({id}) => id === 'ui-virtual-joystick stick'
  )
  return entity
}
