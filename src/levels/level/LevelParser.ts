import {LevelConfig} from './LevelConfig'
import {Level} from './Level'
import {LevelTypeParser} from '../levelType/LevelTypeParser'
import {CameraParser} from '../camera/CameraParser'
import {Cursor} from '../../entities/types/cursor/Cursor'
import {Backpacker} from '../../entities/types/backpacker/Backpacker'
import {Atlas} from '../../atlas/atlas/Atlas'
import {EntityParser} from '../../entities/entity/EntityParser'

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
      parentEntities: EntityParser.parseAll(config.parentEntities, atlas),
      atlas
    }
  }
}
