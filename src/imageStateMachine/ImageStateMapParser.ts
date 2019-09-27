import {Atlas} from '../atlas/Atlas'
import {ImageRectParser, ImageRectConfig} from './ImageRectParser'
import {ImageStateMap} from './ImageStateMap'
import {Entity} from '../entity/Entity'
import {EntityParser, EntityStateConfig} from '../entity/EntityParser'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>

export namespace ImageStateMapParser {
  export function parse(
    config: ImageStateMapConfig,
    atlas: Atlas
  ): ImageStateMap {
    const map: Writable<ImageStateMap> = {
      [Entity.State.HIDDEN]: {
        origin: new XY(0, 0),
        bounds: {position: new XY(0, 0), size: new WH(0, 0)},
        // Always use non-zero scaling so that Entity can determine relative
        // scaling of collision bodies.
        scale: new XY(1, 1),
        images: []
      }
    }
    if (!config) return map
    for (const stateConfig in config) {
      const state = EntityParser.parseState(stateConfig)
      const rectConfig = config[stateConfig]
      map[state] = ImageRectParser.parse(rectConfig, atlas)
    }
    return map
  }
}
