import {Atlas} from '../atlas/atlas'
import {EntityParser} from '../entities/entity-parser'
import {Level} from './level'

export namespace LevelParser {
  export function parse(atlas: Atlas, cfg: Level.Config): Level {
    const {id, w, h, minSize} = cfg
    const entities = cfg.entities.map(cfg => EntityParser.parse(atlas, cfg))
    return {id, w, h, minSize, entities}
  }
}
