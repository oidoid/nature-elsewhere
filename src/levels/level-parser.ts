import * as Atlas from '../atlas/atlas'
import * as EntityParser from '../entities/entity-parser'
import {Level} from './level'
import {LevelConfig} from './level-config'

export function parse(
  atlas: Atlas.State,
  {w, h, minSize, ...cfg}: LevelConfig
): Level {
  const entities = cfg.entities.map(cfg => EntityParser.parse(atlas, cfg))
  return {w, h, minSize, entities}
}
