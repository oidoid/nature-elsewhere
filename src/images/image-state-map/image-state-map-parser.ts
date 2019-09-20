import {EntityState} from '../../entities/entity-state/entity-state'
import {EntityStateParser} from '../../entities/entity-state/entity-state-parser'
import {ImageStateMap} from './image-state-map'
import {ImageStateMapConfig} from './image-state-map-config'
import {ImageRectParser} from '../image-rect/image-rect-parser'
import {Atlas} from '../../atlas/atlas/atlas'

export namespace ImageStateMapParser {
  export function parse(
    config: ImageStateMapConfig,
    atlas: Atlas
  ): ImageStateMap {
    const map: Writable<ImageStateMap> = {
      [EntityState.HIDDEN]: {
        origin: {x: 0, y: 0},
        bounds: {x: 0, y: 0, w: 0, h: 0},
        scale: {x: 0, y: 0},
        images: []
      }
    }
    if (!config) return map
    for (const stateConfig in config) {
      const state = EntityStateParser.parse(stateConfig)
      map[state] = ImageRectParser.parse(config[stateConfig], atlas)
    }
    return map
  }
}
