import * as background from '../assets/entities/background.json'
import * as cloud from '../assets/entities/cloud.json'
import * as conifer from '../assets/entities/conifer.json'
import {EntityConfig} from './entity-config.js'
import {EntityID} from './entity-id.js'
import * as mountain from '../assets/entities/mountain.json'

export const EntityConfigs: Readonly<
  Partial<Record<EntityID.Key, EntityConfig>>
> = Object.freeze({
  BACKGROUND: background,
  CLOUD: cloud,
  CONIFER: conifer,
  MOUNTAIN: mountain
})
