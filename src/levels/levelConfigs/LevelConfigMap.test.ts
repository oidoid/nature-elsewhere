import {Atlas, Parser} from 'aseprite-atlas'
import * as atlasJSON from '../../atlas/atlas.json'
import {LevelConfig, LevelParser} from '../LevelParser'
import {LevelConfigMap} from './LevelConfigMap'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {ValueUtil} from '../../utils/ValueUtil'

const atlas: Atlas = Object.freeze(Parser.parse(atlasJSON))
const configs: readonly LevelConfig[] = ObjectUtil.values(
  LevelConfigMap
).filter(ValueUtil.is)

test.each(configs)(`%# LevelConfig %p is parsable`, config =>
  expect(LevelParser.parse(config, atlas)).toBeTruthy()
)
