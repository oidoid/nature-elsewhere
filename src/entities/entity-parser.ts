import {AnimationID} from '../images/animation-id'
import {Atlas} from '../atlas/atlas'
import * as defaultEntity from '../assets/entities/default.json'
import {Entity} from './entity'
import {EntityConfig} from './entity-config'
import {EntityConfigs} from './entity-configs'
import {EntityID} from './entity-id'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Layer} from '../images/layer'
import {Text} from '../text/text'

const imagesFactory: Partial<
  Record<EntityID.Key, (entity: Entity) => Entity>
> = Object.freeze({TEXT_DATE_VERSION_HASH: newTextDateVersionHash})

export namespace EntityParser {
  export function parse(atlas: Atlas, cfg: EntityConfig): Entity {
    if (!isEntityIDKey(cfg.id))
      throw new Error(`"${cfg.id}" is not a key of EntityID.`)

    const state = (imagesFactory[cfg.id] || newStandardEntity)(
      Object.assign({id: cfg.id}, defaultEntity, cfg)
    )
    return {...state, ...Image.target(atlas, ...state.images)}
  }
}

function isEntityIDKey(val: string): val is EntityID.Key {
  return val in EntityID
}

function newStandardEntity(entity: Entity): Entity {
  const cfg = EntityConfigs[entity.id]
  if (!cfg) throw new Error(`${entity.id} is not a standard entity.`)

  const images = (cfg.images || []).map(({id, layer, ...cfg}) =>
    Image.make(<AnimationID.Key>id, {...cfg, layer: <Layer.Key>layer})
  )
  ImageRect.moveBy({x: 0, y: 0}, {x: entity.x, y: entity.y}, ...images)
  return Object.assign({}, entity, cfg, {images})
}

function newTextDateVersionHash(entity: Entity): Entity {
  const {date, version, hash} = process.env
  const images = Text.toImages(`${date} v${version} (${hash})`, entity)
  return {...entity, images}
}
