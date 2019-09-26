import {Atlas} from '../../atlas/Atlas'
import {Backpacker} from '../../entities/types/backpacker/Backpacker'
import {CameraConfig} from '../camera/CameraParser'
import {CameraParser} from '../camera/CameraParser'
import {Cursor} from '../../entities/types/cursor/Cursor'
import {EntityConfig} from '../../entities/entity/EntityParser'
import {EntityParser} from '../../entities/entity/EntityParser'
import {LevelAdvance} from './LevelAdvance'
import {Level} from './Level'
import {LevelTypeConfig} from '../levelType/LevelTypeParser'
import {LevelTypeParser} from '../levelType/LevelTypeParser'
import {WH} from '../../math/wh/WH'

export interface LevelConfig {
  readonly type: LevelTypeConfig
  /** The level shown when escape or back is pressed. Usually
      LevelType.PAUSE_LEVEL. For the initial level, this is undefined. */
  readonly prevLevel?: LevelTypeConfig
  /** The level shown when the current level is completed. For the last level,
      this is undefined. */
  readonly nextLevel?: LevelTypeConfig
  readonly size: WH
  readonly minViewport: WH
  readonly cam?: CameraConfig
  readonly cursor: EntityConfig
  readonly destination?: EntityConfig
  readonly player?: EntityConfig
  /** Entities to populate the level. Any children of these entities will be
      considered "active" as a first pass if it's parent root entity is. For
      this reason, favoring shallowing entities is best. Entity composition is
      wanted but it is an antipattern to specify a single root parent entity and
      then lump all other entities underneath it as children. The entity update
      system was designed to allow group update relationships, such as
      translations and collisions, to occur from parent to child by only
      surfacing the root parent.

      It's possible to write level sections as single entities. This is probably
      ok if they do not occupy large areas that span multiple viewports since
      that breaks "active" entity viewport filtering. */
  readonly parentEntities: readonly EntityConfig[]
}

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
      advance: LevelAdvance.UNCHANGED,
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
