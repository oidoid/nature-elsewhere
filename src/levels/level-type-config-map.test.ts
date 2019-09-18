import {ObjectUtil} from '../utils/object-util'
import {Atlas} from '../atlas/atlas'
import * as atlasJSON from '../assets/atlas/atlas.json'
import {AtlasParser} from '../atlas/atlas-parser'
import {LevelTypeConfigMap} from './level-type-config-map'
import {LevelParser} from './parsers/level-parser'
import {LevelConfig} from './parsers/level-config'
import {ValueUtil} from '../utils/value-util'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const configs: readonly LevelConfig[] = ObjectUtil.values(
  LevelTypeConfigMap
).filter(ValueUtil.is)

test.each(configs)(`%# LevelConfig %p is parseable`, config =>
  expect(LevelParser.parse(config, atlas)).toBeTruthy()
)
