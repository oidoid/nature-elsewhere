import {AnimationID} from './animation-id'
import * as AsepriteParser from '../aseprite/aseprite-parser'
import * as Atlas from './atlas'
import * as atlasJSON from '../assets/atlas.json'
import * as ObjectUtil from '../utils/object-util'

const atlas: Atlas.State = Object.freeze(AsepriteParser.parse(atlasJSON))
const ids: readonly AnimationID[] = Object.freeze(
  ObjectUtil.values(AnimationID)
)

test.each(ids)('%# AnimationID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

test.each(ids)('%# AnimationID %p has an Animation', id =>
  expect(atlas).toHaveProperty(id)
)

test.each(ObjectUtil.keys(atlas))('%# animation ID %p has a AnimationID', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)
