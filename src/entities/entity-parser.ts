import {AnimationID} from '../images/animation-id'
import {Atlas} from '../atlas/atlas'
import * as defaultEntity from '../assets/entities/default.json'
import {Entity} from './entity'
import {EntityConfig} from './entity-config'
import {EntityConfigs} from './entity-configs'
import {EntityID} from './entity-id'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {Text} from '../text/text'

const imagesFactory: Partial<
  Record<EntityID.Key, (atlas: Atlas, entity: Entity) => Entity>
> = Object.freeze({TEXT_DATE_VERSION_HASH: newTextDateVersionHash})

export namespace EntityParser {
  export function parse(atlas: Atlas, cfg: EntityConfig): Entity {
    if (!isEntityIDKey(cfg.id))
      throw new Error(`"${cfg.id}" is not a key of EntityID.`)

    const state = (imagesFactory[cfg.id] || newStandardEntity)(
      atlas,
      Object.assign({id: cfg.id}, defaultEntity, cfg)
    )
    return {...state, ...Image.target(...state.images)}
  }
}

function isEntityIDKey(val: string): val is EntityID.Key {
  return val in EntityID
}

function newStandardEntity(atlas: Atlas, entity: Entity): Entity {
  const cfg = EntityConfigs[entity.id]
  if (!cfg) throw new Error(`${entity.id} is not a standard entity.`)

  const images = (cfg.images || [])
    .concat(entity.images)
    .concat((cfg.seeds && cfg.seeds[entity.seed || 0]) || [])
    .map(({id, ...cfg}) =>
      Image.make(
        atlas,
        <AnimationID.Key>id,
        <Image.Options>{
          sx: entity.sx,
          sy: entity.sy,
          ...cfg
        }
      )
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
  return {...entity, x, y, images}
}
