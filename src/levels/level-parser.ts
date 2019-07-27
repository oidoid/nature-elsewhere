import {Atlas} from '../atlas/atlas'
import {EntityParser} from '../entities/entity-parser'
import {Level} from './level'
import {LevelConfig} from './level-config'

export namespace LevelParser {
  export function parse(
    atlas: Atlas,
    {w, h, minSize, ...cfg}: LevelConfig
  ): Level {
    const entities = cfg.entities.map(cfg => EntityParser.parse(atlas, cfg))
    return {w, h, minSize, entities}
  }
}
