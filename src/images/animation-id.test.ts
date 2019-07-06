import * as atlasJSON from '../assets/atlas.json'
import {AnimationID} from './animation-id'
import {AsepriteParser} from '../parsers/aseprite-parser'
import {Atlas} from './atlas'
import {ObjectUtil} from '../utils/object-util'

const state: Atlas.Definition = Object.freeze(AsepriteParser.parse(atlasJSON))
const ids: readonly AnimationID[] = Object.freeze(
  ObjectUtil.values(AnimationID)
)

test.each(ids)('%# AnimationID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

test.each(ids)('%# AnimationID %p has an Animation', id =>
  expect(state.animations).toHaveProperty(id)
)

test.each(ObjectUtil.keys(state.animations))(
  '%# animation ID %p has a AnimationID',
  id => expect(ids.filter(val => id === val)).toHaveLength(1)
)
