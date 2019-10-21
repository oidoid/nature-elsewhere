import {Atlas} from 'aseprite-atlas'
import {SpriteRect} from './SpriteRect'
import {SpriteRectParser} from './SpriteRectParser'
import {SpriteStateMap} from './SpriteStateMachine'
import {SpriteStateMapConfig} from './SpriteStateMachineConfig'

export namespace SpriteStateMachineParser {
  export function parseMap(
    atlas: Atlas,
    config: SpriteStateMapConfig
  ): SpriteStateMap {
    const map: Record<string, SpriteRect> = {}
    if (!config) return map
    for (const stateConfig in config) {
      const state = stateConfig
      const rectConfig = config[stateConfig]
      map[state] = SpriteRectParser.parse(atlas, rectConfig)
    }
    return map
  }
}
