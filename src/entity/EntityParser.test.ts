import * as atlasJSON from '../atlas/atlas.json'
import {Atlas, Parser} from 'aseprite-atlas'
import {EntityParser} from './EntityParser'
import {EntityType} from './EntityType'

const atlas: Atlas = Object.freeze(Parser.parse(atlasJSON))
const types: readonly EntityType[] = Object.values(EntityType)

test.each(types)('%# type %p is parsable', type =>
  expect(EntityParser.parse({type}, atlas)).toBeTruthy()
)
