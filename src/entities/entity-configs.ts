import * as bee from '../assets/entities/bee.json'
import * as bush from '../assets/entities/bush.json'
import * as cloud from '../assets/entities/cloud.json'
import * as clover from '../assets/entities/clover.json'
import * as conifer from '../assets/entities/conifer.json'
import {EntityConfig} from './entity-config.js'
import * as grass from '../assets/entities/grass.json'
import * as images from '../assets/entities/images.json'
import * as mountain from '../assets/entities/mountain.json'
import * as pyramid from '../assets/entities/pyramid.json'
import * as tree from '../assets/entities/tree.json'

export const EntityConfigs: Readonly<
  Partial<Record<string, EntityConfig>>
> = Object.freeze({
  bee,
  bush,
  cloud,
  clover,
  conifer,
  grass,
  images,
  mountain,
  pyramid,
  tree
})
