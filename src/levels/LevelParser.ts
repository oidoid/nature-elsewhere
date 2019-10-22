import {Atlas} from 'aseprite-atlas'
import {Backpacker} from '../entities/Backpacker'
import {CameraParser} from './CameraParser'
import {Cursor} from '../entities/Cursor'
import {DestinationMarker} from '../entities/DestinationMarker'
import {EntityParser} from '../entity/EntityParser'
import {Level} from './Level'
import {LevelAdvance} from './LevelAdvance'
import {LevelConfig} from './LevelConfig'
import {LevelEditorSandbox} from '../entities/levelEditor/LevelEditorSandbox'
import {LevelTypeParser} from './LevelTypeParser'
import {Plane} from '../entities/Plane'
import {WHParser} from '../math/WHParser'

export namespace LevelParser {
  export const version: string = '0.0.0'

  export function parse(config: LevelConfig, atlas: Atlas): Level {
    if (config.version !== version)
      throw new Error(`Unsupported level config version "${config.version}".`)

    const level: Writable<Level> = {
      type: LevelTypeParser.parse(config.type),
      advance: LevelAdvance.UNCHANGED,
      size: WHParser.parse(config.size),
      minViewport: WHParser.parse(config.minViewport),
      cam: CameraParser.parse(config.cam),
      planes: <Plane[]>EntityParser.parseAll(atlas, config.planes),
      cursor: <Cursor>EntityParser.parse(config.cursor, atlas),
      hud: EntityParser.parseAll(atlas, config.hud),
      parentEntities: EntityParser.parseAll(atlas, config.parentEntities),
      atlas
    }
    if (config.destination)
      level.destination = <DestinationMarker>(
        EntityParser.parse(config.destination, atlas)
      )
    if (config.player)
      level.player = <Backpacker>EntityParser.parse(config.player, atlas)
    if (config.sandbox)
      level.sandbox = <LevelEditorSandbox>(
        EntityParser.parse(config.sandbox, atlas)
      )
    return level
  }
}
