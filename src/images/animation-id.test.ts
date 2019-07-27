import {AnimationID} from './animation-id'
import {Atlas} from '../atlas/atlas'
import * as atlasJSON from '../assets/atlas/atlas.json'
import {AtlasParser} from '../atlas/atlas-parser'
import {ObjectUtil} from '../utils/object-util'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const ids: readonly (keyof typeof AnimationID)[] = Object.freeze(
  ObjectUtil.keys(AnimationID)
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
