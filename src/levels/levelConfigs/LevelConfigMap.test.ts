import * as atlasJSON from '../../atlas/atlas.json'
import {Atlas, Parser} from 'aseprite-atlas'
import {LevelConfig} from '../LevelConfig.js'
import {LevelParser} from '../LevelParser'
import {LevelConfigMap} from './LevelConfigMap'
import {ValueUtil} from '../../utils/ValueUtil'

const atlas: Atlas = Object.freeze(Parser.parse(atlasJSON))
const configs: readonly LevelConfig[] = Object.values(LevelConfigMap).filter(
  ValueUtil.is
)

test.each(configs)(`%# LevelConfig %p is parsable`, config =>
  expect(LevelParser.parse(config, atlas)).toBeTruthy()
)
