import {AnimationID} from '../images/animation-id'
import * as Atlas from '../atlas/atlas'
import * as Entity from './entity'
import {EntityConfig} from './entity-config'
import {EntityConfigs} from './entity-configs'
import {EntityID} from './entity-id'
import * as Image from '../images/image'
import * as ImageRect from '../images/image-rect'
import {Layer} from '../images/layer'
import * as Text from '../text/text'

const factory: Partial<
  Record<
    keyof typeof EntityID,
    (entity: Entity.State) => readonly Readonly<Image.State>[]
  >
> = Object.freeze({
  TEXT_DATE_VERSION_HASH: newTextDateVersionHash
})

export function parse(atlas: Atlas.State, cfg: EntityConfig): Entity.State {
  const state = defaultState(cfg)
  const images = (factory[state.id] || newStandardEntity)(state)
  return {...state, ...Image.target(atlas, ...images), images}
}

function defaultState(cfg: EntityConfig): Entity.State {
  if (!isEntityIDKey(cfg.id))
    throw new Error(`"${cfg.id}" is not a key of EntityID.`)
  return Object.assign(
    {
      id: cfg.id,
      seed: 0,
      inactive: false,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      velocity: {x: 0, y: 0},
      acceleration: {x: 0, y: 0},
      images: []
    },
    cfg
  )
}

function isEntityIDKey(val: string): val is keyof typeof EntityID {
  return val in EntityID
}

function newStandardEntity({id, x, y}: Entity.State): Readonly<Image.State>[] {
  const config = EntityConfigs[id]
  if (!config) throw new Error(`${id} is not a standard entity.`)

  const images = (config.images || []).map(({id, layer, ...cfg}) =>
    Image.make(<keyof typeof AnimationID>id, {
      ...cfg,
      layer: <keyof typeof Layer>(<any>layer)
    })
  )
  ImageRect.moveBy({x: 0, y: 0}, {x: x || 0, y: y || 0}, ...images)

  return images
}

function newTextDateVersionHash(
  entity: Entity.State
): readonly Readonly<Image.State>[] {
  const {date, version, hash} = process.env
  return Text.toImages(`${date} v${version} (${hash})`, entity)
}
