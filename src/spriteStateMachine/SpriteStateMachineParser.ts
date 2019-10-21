import {Atlas} from 'aseprite-atlas'
import {EntityParser, EntityStateConfig} from '../entity/EntityParser'
import {SpriteRectConfig, SpriteRectParser} from './SpriteRectParser'
import {SpriteRect} from './SpriteRect'
import {Entity} from '../entity/Entity'
import {SpriteStateMap} from './SpriteStateMachine'

export type SpriteStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, SpriteRectConfig>>
>

export namespace SpriteStateMachineParser {
  export function parseMap(
    atlas: Atlas,
    config: SpriteStateMapConfig
  ): SpriteStateMap {
    const map: Record<Entity.BaseState | string, SpriteRect> = {
      [Entity.BaseState.HIDDEN]: new SpriteRect()
    }
    if (!config) return map
    for (const stateConfig in config) {
      const state = EntityParser.parseState(stateConfig)
      const rectConfig = config[stateConfig]
      map[state] = SpriteRectParser.parse(atlas, rectConfig)
    }
    return map
  }
}
