import {Atlas, Parser} from 'aseprite-atlas'
import {AtlasID} from './AtlasID'
import * as atlasJSON from './atlas.json'
import {ObjectUtil} from '../utils/ObjectUtil'
import {TestUtil} from '../utils/TestUtil'

const atlas: Atlas = Parser.parse(atlasJSON)
const ids: readonly AtlasID[] = Object.freeze(ObjectUtil.values(AtlasID))

test.each(ids)('%# AtlasID %p has an Animation', id =>
  expect(atlas.animations).toHaveProperty(id)
)

test.each(Object.keys(atlas.animations))(
  '%# animation ID %p has a AtlasID',
  id => expect(ids.filter(val => id === val)).toHaveLength(1)
)

TestUtil.testValuesAreUnique(AtlasID, 'AtlasID')
