import {ImageStateMachine} from './ImageStateMachine'
import {Atlas} from 'aseprite-atlas'
import {ObjectUtil} from '../utils/ObjectUtil'
import {ImageStateMapConfig, ImageStateMapParser} from './ImageStateMapParser'
import {EntityParser, EntityStateConfig} from '../entity/EntityParser'

export type ImageStateMachineConfig = Maybe<
  Readonly<{state?: EntityStateConfig; map?: ImageStateMapConfig}>
>

export namespace ImageStateMachineParser {
  export function parse(
    config: ImageStateMachineConfig,
    atlas: Atlas
  ): ImageStateMachine {
    if (!config) return new ImageStateMachine()
    const state = EntityParser.parseState(config.state)
    const map = ImageStateMapParser.parse(config.map, atlas)
    ObjectUtil.assertKeyOf(map, state, 'ImageStateMachine')
    return new ImageStateMachine({state, map})
  }
}
