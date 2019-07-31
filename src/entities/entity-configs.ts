import * as bee from '../assets/entities/bee.json'
import * as cloud from '../assets/entities/cloud.json'
import * as clover from '../assets/entities/clover.json'
import * as conifer from '../assets/entities/conifer.json'
import {EntityConfig} from './entity-config.js'
import {EntityID} from './entity-id.js'
import * as images from '../assets/entities/images.json'
import * as mountain from '../assets/entities/mountain.json'
import * as tree from '../assets/entities/tree.json'

export const EntityConfigs: Readonly<
  Partial<Record<EntityID.Key, EntityConfig>>
> = Object.freeze({
  BEE: bee,
  CLOUD: cloud,
  CLOVER: clover,
  CONIFER: conifer,
  IMAGES: images,
  MOUNTAIN: mountain,
  TREE: tree
})
