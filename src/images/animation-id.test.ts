import * as asepriteParser from '../parsers/aseprite-parser'
import * as atlasAseprite from '../assets/atlas.json'
import {AnimationID} from './animation-id'

const state = asepriteParser.parse(atlasAseprite)
const ids: AnimationID[] = Object.values(AnimationID)

test.each(ids)('%# AnimationID %p is unique', (id: AnimationID) =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

test.each(ids)('%# AnimationID %p has an Animation', (id: AnimationID) =>
  expect(state.animations).toHaveProperty(id)
)

test.each(Object.keys(state.animations))(
  '%# animation ID %p has a AnimationID',
  (id: string) => expect(ids.filter(val => id === val)).toHaveLength(1)
)
