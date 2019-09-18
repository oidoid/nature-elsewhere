import {EntityState} from '../../entities/entity-state'
import {EntityStateParser} from '../../entities/parsers/entity-state-parser'
import {ImageStateMap} from './image-state-map'
import {ImageStateMapConfig} from './image-state-map-config'
import {ImageRectParser} from '../image-rect/image-rect-parser'
import {Atlas} from '../../atlas/atlas/atlas'

export namespace ImageStateMapParser {
  export function parse(
    config: ImageStateMapConfig,
    atlas: Atlas
  ): ImageStateMap {
    const init: ImageStateMap = {
      [EntityState.HIDDEN]: {
        bounds: {x: 0, y: 0, w: 0, h: 0},
        scale: {x: 1, y: 1},
        images: []
      }
    }
    if (!config) return init
    return {
      ...Object.entries(config).reduce(
        (system, [stateConfig, rectConfig]) => ({
          ...system,
          [EntityStateParser.parse(stateConfig)]: ImageRectParser.parse(
            rectConfig,
            atlas
          )
        }),
        init
      )
    }
  }
}
