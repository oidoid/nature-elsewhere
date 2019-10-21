import {Atlas} from 'aseprite-atlas'
import {EntityStateConfig} from '../entity/EntityParser'
import {SpriteRect} from './SpriteRect'
import {SpriteRectConfig, SpriteRectParser} from './SpriteRectParser'
import {SpriteStateMap} from './SpriteStateMachine'

export type SpriteStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, SpriteRectConfig>>
>

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
