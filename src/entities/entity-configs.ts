import * as cloud from '../assets/entities/cloud.json'
import * as conifer from '../assets/entities/conifer.json'
import {EntityConfig} from './entity-config.js'
import {EntityID} from './entity-id.js'
import * as images from '../assets/entities/images.json'
import * as mountain from '../assets/entities/mountain.json'

export const EntityConfigs: Readonly<
  Partial<Record<EntityID.Key, EntityConfig>>
> = Object.freeze({
  CLOUD: cloud,
  CONIFER: conifer,
  IMAGES: images,
  MOUNTAIN: mountain
})
