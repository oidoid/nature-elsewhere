import {Atlas} from '../../atlas/Atlas'
import * as atlasJSON from '../../atlas/atlas.json'
import {AtlasParser} from '../../atlas/AtlasParser'
import {EntityParser} from './EntityParser'
import {EntityType} from './EntityType'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const types: readonly EntityType[] = Object.values(EntityType)

test.each(types)(`%# type %p is parsable`, type =>
  expect(EntityParser.parse({type}, atlas)).toBeTruthy()
)
