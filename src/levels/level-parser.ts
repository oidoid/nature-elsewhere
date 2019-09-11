import {Atlas} from '../atlas/atlas'
import {EntityRectParser} from '../entities/entity-rect-parser'
import {Level} from './level'
import {LevelConfig} from './level-config'

export namespace LevelParser {
  export const parse = (atlas: Atlas, cfg: LevelConfig): Level => {
    const {id, w, h, minSize, entities} = cfg
    return {
      id,
      w,
      h,
      minSize,
      behavior: 'NONE',
      entities: EntityRectParser.parse(atlas, {entities}).entities
    }
  }
}
