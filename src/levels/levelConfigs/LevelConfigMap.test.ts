import {ObjectUtil} from '../../utils/ObjectUtil'
import {Atlas} from '../../atlas/atlas/Atlas'
import * as atlasJSON from '../../atlas/atlasAssets/atlas.json'
import {LevelConfigMap} from './LevelConfigMap'
import {LevelParser, LevelConfig} from '../level/LevelParser'
import {ValueUtil} from '../../utils/ValueUtil'
import {AtlasParser} from '../../atlas/atlas/AtlasParser'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const configs: readonly LevelConfig[] = ObjectUtil.values(
  LevelConfigMap
).filter(ValueUtil.is)

test.each(configs)(`%# LevelConfig %p is parsable`, config =>
  expect(LevelParser.parse(config, atlas)).toBeTruthy()
)
