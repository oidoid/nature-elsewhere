import {Atlas} from '../../atlas/atlas/atlas'
import * as atlasJSON from '../../atlas/atlas-assets/atlas.json'
import {AtlasParser} from '../../atlas/atlas/atlas-parser'
import {EntityParser} from './entity-parser'
import {EntityType} from '../entity-type/entity-type'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const types: readonly EntityType[] = Object.values(EntityType)

test.each(types)(`%# type %p is parsable`, type =>
  expect(EntityParser.parse({type}, atlas)).toBeTruthy()
)
