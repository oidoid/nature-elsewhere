import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import {Build} from '../utils/build'
import * as defaultEntity from '../assets/entities/default.json'
import {EntityConfigs} from './entity-configs'
import {Entity} from './entity'
import {Image} from '../images/image'
import {ImageRect} from '../images/image-rect'
import {JSONObject, JSONUtil} from '../utils/json-util'
import {ObjectUtil} from '../utils/object-util'
import {TextEntity} from './text-entity'
import {Text} from '../text/text'
import {UpdateType} from '../store/update-type'
import {XY} from '../math/xy'

const imagesFactory: Partial<
  Record<string, (atlas: Atlas, entity: Entity) => Entity>
> = Object.freeze({
  dateVersionHash: newDateVersionHash,
  text: TextEntity.make
})

export namespace EntityParser {
  export function parse(atlas: Atlas, cfg: Entity.Config): Entity {
    const defaults = <Required<Entity.Config> & {readonly scale: XY}>(
      JSONUtil.merge(
        defaultEntity,
        cfg.id ? <JSONObject>EntityConfigs[cfg.id] : {},
        <JSONObject>cfg
      )
    )
    const entity: Entity = {
      id: defaults.id,
      state: defaults.state,
      updateType: parseUpdateType(defaults.updateType),
      behavior: parseBehaviorKey(defaults.behavior),
      scale: defaults.scale,
      vx: defaults.vx,
      vy: defaults.vy,
      ax: defaults.ax,
      ay: defaults.ay,
      states: ObjectUtil.entries(defaults.states).reduce(
        (sum, [key, val]) => ({
          ...sum,
          [key]: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            images: val.map(
              val =>
                Image.make(atlas, {...val, scale: val.scale || defaults.scale}) // maybe i can pass this in from entity and use it when non-1. maybe same for w/h
            )
          }
        }),
        {}
      )
    }
    if ('text' in cfg) (<any>entity).text = cfg['text']

    // how to join states here?
    // there is a difference in the images in htat it's really just use a constructor template thingy
    // replace scale with references

    const ctor = imagesFactory[defaults.id]
    const state: Entity = ctor ? ctor(atlas, entity) : entity

    ObjectUtil.values(state.states).forEach(rect => {
      const {w, h} = Image.target(...rect.images)
      ;(<any>rect).w = w
      ;(<any>rect).h = h
    })

    state.states[state.state] = ImageRect.moveBy(
      state.states[state.state],
      {x: defaults.x, y: defaults.y},
      ...state.states[state.state].images
    )

    return state
  }
}

const parseUpdateType = (val: string): UpdateType.Key => {
  if (isUpdateTypeKey(val)) return val
  throw new Error(`"${val}" is not a key of UpdateType.`)
}

const parseBehaviorKey = (val: string): Behavior.Key => {
  if (isBehaviorKey(val)) return val
  throw new Error(`"${val}" is not a key of Behavior.`)
}

function isUpdateTypeKey(val: string): val is UpdateType.Key {
  return val in UpdateType
}

function isBehaviorKey(val: string): val is Behavior.Key {
  return val in Behavior
}

function newDateVersionHash(atlas: Atlas, entity: Entity): Entity {
  // use the text fnuction
  const {date, version, hash} = Build
  const images = Text.toImages(atlas, `${date} v${version} (${hash})`)
  return {...entity, states: {'0': {x: 0, y: 0, w: 0, h: 0, images}}}
}
