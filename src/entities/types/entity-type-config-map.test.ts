import {EntityTypeConfigMap} from './entity-type-config-map'
import {EntityParser} from '../parsers/entity-parser'
import {ObjectUtil} from '../../utils/object-util'
import {Atlas} from '../../atlas/atlas/atlas'
import * as atlasJSON from '../../assets/atlas/atlas.json'
import {EntityConfig} from '../parsers/entity-config'
import {AtlasParser} from '../../atlas/atlas/atlas-parser'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const configs: readonly EntityConfig[] = ObjectUtil.values(EntityTypeConfigMap)

test.each(configs)(`%# EntityConfig %p is parseable`, config =>
  expect(EntityParser.parse(config, atlas)).toBeTruthy()
)
