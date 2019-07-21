import * as Atlas from '../atlas/atlas'
import * as Entity from '../entities/entity'
import {EntityType} from '../entities/entity-type'
import {LevelConfig} from './level-config'
import {Level} from './level'
import * as ObjectUtil from '../utils/object-util'

export function parse(
  atlas: Atlas.State,
  {w, h, minSize, entities}: LevelConfig
): Level {
  return {w, h, minSize, entities: entities.map(cfg => parseEntity(atlas, cfg))}
}

function parseEntity(
  atlas: Atlas.State,
  cfg: Entity.Config | {readonly type: string}
): Entity.State {
  if (!isEntityConfig(cfg)) throw new Error(`Unknown EntityType "${cfg.type}".`)
  return Entity.make(atlas, cfg)
}

function isEntityConfig(
  cfg: Entity.Config | {readonly type: string}
): cfg is Entity.Config {
  return ObjectUtil.hasKey(EntityType, cfg.type)
}
