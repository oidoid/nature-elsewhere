import {Atlas} from 'aseprite-atlas'
import {EntityParser, EntityStateConfig} from '../entity/EntityParser'
import {ImageRectConfig, ImageRectParser} from './ImageRectParser'
import {ImageRect} from './ImageRect'
import {Entity} from '../entity/Entity'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>

export namespace ImageStateMapParser {
  export function parse(
    config: ImageStateMapConfig,
    atlas: Atlas
  ): Readonly<Record<Entity.BaseState | string, ImageRect>> {
    const map: Record<Entity.BaseState | string, ImageRect> = {
      [Entity.BaseState.HIDDEN]: new ImageRect()
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
