import {Atlas} from '../../atlas/atlas/Atlas'
import {EntityState} from '../../entities/entityState/EntityState'
import {
  EntityStateParser,
  EntityStateConfig
} from '../../entities/entityState/EntityStateParser'
import {ImageRectParser, ImageRectConfig} from '../imageRect/ImageRectParser'
import {ImageStateMap} from './ImageStateMap'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>

export namespace ImageStateMapParser {
  export function parse(
    config: ImageStateMapConfig,
    atlas: Atlas
  ): ImageStateMap {
    const map: Writable<ImageStateMap> = {
      [EntityState.HIDDEN]: {
        origin: {x: 0, y: 0},
        bounds: {position: {x: 0, y: 0}, size: {w: 0, h: 0}},
        // Always use non-zero scaling so that Entity can determine relative
        // scaling of collision bodies.
        scale: {x: 1, y: 1},
        images: []
      }
    }
    if (!config) return map
    for (const stateConfig in config) {
      const state = EntityStateParser.parse(stateConfig)
      const rectConfig = config[stateConfig]
      map[state] = ImageRectParser.parse(rectConfig, atlas)
    }
    return map
  }
}
