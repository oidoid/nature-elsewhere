import * as atlasJSON from './atlas.json'
import {Atlas, Parser} from 'aseprite-atlas'
import {AtlasID} from './AtlasID'

const atlas: Atlas = Parser.parse(atlasJSON)
const ids: readonly AtlasID[] = Object.freeze(Object.values(AtlasID))

// Every AtlasID exists in the Atlas.
test.each(ids)('%# AtlasID %p has an Animation', id =>
  expect(atlas.animations).toHaveProperty(id)
)

// Every Animation ID in the Atlas exists in AtlasID.
test.each(Object.keys(atlas.animations))(
  '%# animation ID %p has an AtlasID',
  id => expect(ids).toContainEqual(id)
)

// Every AtlasID value is unique.
test.each(ids)(`%# AtlasID %p is unique`, id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)
