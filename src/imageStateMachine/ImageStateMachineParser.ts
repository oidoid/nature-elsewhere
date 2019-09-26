import {ImageStateMachine} from './ImageStateMachine'
import {Atlas} from '../atlas/Atlas'
import {ObjectUtil} from '../utils/ObjectUtil'
import {ImageStateMapParser, ImageStateMapConfig} from './ImageStateMapParser'
import {Entity} from '../entity/Entity'
import {EntityStateConfig, EntityParser} from '../entity/EntityParser'

export type ImageStateMachineConfig = Maybe<
  Readonly<{state?: EntityStateConfig; map?: ImageStateMapConfig}>
>

export namespace ImageStateMachineParser {
  export function parse(
    config: ImageStateMachineConfig,
    atlas: Atlas
  ): ImageStateMachine {
    if (!config)
      return {
        state: Entity.State.HIDDEN,
        map: ImageStateMapParser.parse(undefined, atlas)
      }
    const state = EntityParser.parseState(config.state)
    const map = ImageStateMapParser.parse(config.map, atlas)
    ObjectUtil.assertKeyOf(map, state, 'ImageStateMachine')
    return {state, map}
  }
}
