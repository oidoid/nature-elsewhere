import {Atlas} from 'aseprite-atlas'
import {EntityParser, EntityStateConfig} from '../entity/EntityParser'
import {ImageRectConfig, ImageRectParser} from './ImageRectParser'
import {ImageStateMap} from './ImageStateMap'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>

export namespace ImageStateMapParser {
  export function parse(
    config: ImageStateMapConfig,
    atlas: Atlas
  ): ImageStateMap {
    const map: Writable<ImageStateMap> = ImageStateMap.make()
    if (!config) return map
    for (const stateConfig in config) {
      const state = EntityParser.parseState(stateConfig)
      const rectConfig = config[stateConfig]
      map[state] = ImageRectParser.parse(rectConfig, atlas)
    }
    return map
  }
}
