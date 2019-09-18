import {LevelConfig} from './level-config'
import {Level} from '../level'
import {LevelTypeParser} from './level-type-parser'
import {EntityArrayParser} from '../../entities/parsers/entity-array-parser'
import {CameraParser} from './camera-parser'
import {EntityParser} from '../../entities/parsers/entity-parser'
import {Cursor} from '../../entities/types/ui/cursor'
import {Backpacker} from '../../entities/types/backpacker'
import {Atlas} from '../../atlas/atlas/atlas'

export namespace LevelParser {
  export function parse(config: LevelConfig, atlas: Atlas): Level {
    return {
      type: LevelTypeParser.parse(config.type),
      prevLevel: config.prevLevel
        ? LevelTypeParser.parse(config.prevLevel)
        : undefined,
      nextLevel: config.nextLevel
        ? LevelTypeParser.parse(config.nextLevel)
        : undefined,
      advance: Level.Advance.UNCHANGED,
      size: config.size,
      minViewport: config.minViewport,
      cam: CameraParser.parse(config.cam),
      cursor: <Cursor>EntityParser.parse(config.cursor, atlas),
      destination: config.destination
        ? EntityParser.parse(config.destination, atlas)
        : undefined,
      player: config.player
        ? <Backpacker>EntityParser.parse(config.player, atlas)
        : undefined,
      parentEntities: EntityArrayParser.parse(config.parentEntities, atlas),
      atlas
    }
  }
}
