import {ObjectUtil} from '../../utils/object-util'
import {Atlas} from '../../atlas/atlas/atlas'
import * as atlasJSON from '../../assets/atlas/atlas.json'
import {LevelTypeConfigMap} from './level-type-config-map'
import {LevelParser} from '../level/level-parser'
import {LevelConfig} from '../level/level-config'
import {ValueUtil} from '../../utils/value-util'
import {AtlasParser} from '../../atlas/atlas/atlas-parser'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const configs: readonly LevelConfig[] = ObjectUtil.values(
  LevelTypeConfigMap
).filter(ValueUtil.is)

test.each(configs)(`%# LevelConfig %p is parseable`, config =>
  expect(LevelParser.parse(config, atlas)).toBeTruthy()
)
