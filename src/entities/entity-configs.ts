import * as backpacker from '../assets/entities/backpacker.json'
import * as bee from '../assets/entities/bee.json'
import * as bunny from '../assets/entities/bunny.json'
import * as bush from '../assets/entities/bush.json'
import * as cattails from '../assets/entities/cattails.json'
import * as cloud from '../assets/entities/cloud.json'
import * as clover from '../assets/entities/clover.json'
import * as conifer from '../assets/entities/conifer.json'
import * as cursor from '../assets/entities/cursor.json'
import * as dateVersionHash from '../assets/entities/date-version-hash.json'
import * as destination from '../assets/entities/destination.json'
import * as editor from '../assets/entities/editor.json'
import {EntityConfig} from './entity-config'
import * as flag from '../assets/entities/flag.json'
import * as fly from '../assets/entities/fly.json'
import * as followPlayer from '../assets/entities/follow-player.json'
import * as frog from '../assets/entities/frog.json'
import * as grass from '../assets/entities/grass.json'
import * as isoGrass from '../assets/entities/iso-grass.json'
import * as mountain from '../assets/entities/mountain.json'
import * as path from '../assets/entities/path.json'
import * as pond from '../assets/entities/pond.json'
import * as pyramid from '../assets/entities/pyramid.json'
import * as snake from '../assets/entities/snake.json'
import * as subshrub from '../assets/entities/subshrub.json'
import * as text from '../assets/entities/text.json'
import * as tree from '../assets/entities/tree.json'

export const EntityConfigs: Readonly<
  Partial<Record<string, EntityConfig>>
> = Object.freeze({
  backpacker,
  bee,
  bunny,
  bush,
  cattails,
  cloud,
  clover,
  conifer,
  cursor,
  dateVersionHash,
  destination,
  editor,
  flag,
  fly,
  followPlayer,
  frog,
  grass,
  isoGrass,
  mountain,
  path,
  pond,
  pyramid,
  snake,
  subshrub,
  text,
  tree
})
