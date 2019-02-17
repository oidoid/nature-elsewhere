import * as asepriteParser from '../parsers/aseprite-parser'
import * as atlasAseprite from '../assets/atlas.json'
import * as object from '../utils/object'
import {AnimationID} from './animation-id'
import {AtlasDefinition} from './atlas-definition'

const state: AtlasDefinition = object.freeze(
  asepriteParser.parse(atlasAseprite)
)
const ids: ReadonlyArray<AnimationID> = object.freeze(
  object.values(AnimationID)
)

test.each(ids)('%# AnimationID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

test.each(ids)('%# AnimationID %p has an Animation', id =>
  expect(state.animations).toHaveProperty(id)
)

test.each(object.keys(state.animations))(
  '%# animation ID %p has a AnimationID',
  id => expect(ids.filter(val => id === val)).toHaveLength(1)
)
