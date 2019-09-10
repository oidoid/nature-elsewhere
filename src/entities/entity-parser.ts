import {Atlas} from '../atlas/atlas'
import {Behavior} from './behavior'
import {Build} from '../utils/build'
import * as defaultEntity from '../assets/entities/default.json'
import {EntityConfig} from './entity-config'
import {EntityConfigs} from './entity-configs'
import {Entity} from './entity'
import {Image} from '../images/image'
import {ImageConfig} from '../images/image-config'
import {ImageParser} from '../images/image-parser'
import {ImageRect} from '../images/image-rect'
import {JSONObject, JSONUtil} from '../utils/json-util'
import {ObjectUtil} from '../utils/object-util'
import {Text} from './text'
import {UIEditorButton} from './ui-editor-button'
import {UpdateType} from '../store/update-type'

export namespace EntityParser {
  export const parse = (atlas: Atlas, cfg: EntityConfig): Entity => {
    const defaults = parseDefaults(cfg)
    const entity = {
      ...defaults,
      updateType: parseUpdateType(defaults.updateType),
      behavior: parseBehaviorKey(defaults.behavior),
      states: ObjectUtil.entries(defaults.states).reduce(
        (sum, [key, val]) => ({
          ...sum,
          [key]: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            images: val.map(val => parseImage(atlas, defaults, val))
          }
        }),
        {}
      )
    }

    // how to join states here?
    // there is a difference in the images in htat it's really just use a constructor template thingy
    // replace scale with references

    const ctor = imagesFactory[defaults.id]
    const state: Entity = ctor ? ctor(atlas, entity) : entity

    Object.values(state.states).forEach(ImageRect.invalidate)

    state.states[state.state] = ImageRect.moveBy(state.states[state.state], {
      x: defaults.x,
      y: defaults.y
    })

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

const isUpdateTypeKey = (val: string): val is UpdateType.Key =>
  val in UpdateType

const isBehaviorKey = (val: string): val is Behavior.Key => val in Behavior

const newDateVersionHash = (atlas: Atlas, entity: Entity): Entity => {
  const {date, version, hash} = Build
  const text = `${date} v${version} (${hash})`
  return Text.make(atlas, {...entity, id: 'text', text})
}

const imagesFactory: Partial<
  Record<string, (atlas: Atlas, entity: Entity) => Entity>
> = Object.freeze({
  dateVersionHash: newDateVersionHash,
  text: Text.make,
  uiEditorButton: UIEditorButton.make
})

const parseDefaults = (cfg: EntityConfig): DeepRequired<EntityConfig> =>
  <DeepRequired<EntityConfig>>(
    JSONUtil.merge(
      defaultEntity,
      <JSONObject>(cfg.id && EntityConfigs[cfg.id]) || {},
      <JSONObject>cfg
    )
  )

const parseImage = (
  atlas: Atlas,
  defaults: DeepRequired<EntityConfig>,
  val: ImageConfig
): Image =>
  ImageParser.parse(atlas, {
    ...val,
    // maybe i can pass this in from entity and use it when non-1. maybe same for w/h
    scale: val.scale || defaults.scale,
    period: defaults.period
  })
