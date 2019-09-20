import {EntityTypeConfigMap} from './entity-type-config-map'
import {ObjectUtil} from '../../utils/object-util'
import {Atlas} from '../../atlas/atlas/atlas'
import * as atlasJSON from '../../atlas/atlas-assets/atlas.json'
import {EntityConfig} from '../entity/entity-config'
import {AtlasParser} from '../../atlas/atlas/atlas-parser'
import {EntityParser} from '../entity/entity-parser'

const atlas: Atlas = Object.freeze(AtlasParser.parse(atlasJSON))
const configs: readonly EntityConfig[] = ObjectUtil.values(EntityTypeConfigMap)

test.each(configs)(`%# EntityConfig %p is parsable`, config =>
  expect(EntityParser.parse(config, atlas)).toBeTruthy()
)
