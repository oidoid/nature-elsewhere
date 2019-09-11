import {Atlas} from '../atlas/atlas'
import {EntityParser} from '../entities/entity-parser'
import {EntityRect} from './entity-rect'
import {EntityRectConfig} from './entity-rect-config'
import {EntityRectBehavior} from './entity-rect-behavior'

export namespace EntityRectParser {
  export const parse = (atlas: Atlas, cfg: EntityRectConfig): EntityRect => {
    const {x, y} = {x: cfg.x || 0, y: cfg.y || 0}
    const entities = cfg.entities.map(val =>
      'entities' in val ? parse(atlas, val) : EntityParser.parse(atlas, val)
    )
    const behavior = cfg.behavior || 'NONE'
    if (!isBehaviorKey(behavior))
      throw new Error(`Unknown behavior "${behavior}".`)
    const ret = EntityRect.moveTo(
      {x: 0, y: 0, w: 0, h: 0, behavior, entities},
      {x, y}
    )
    EntityRect.invalidate(ret)
    return ret
  }

  const isBehaviorKey = (val: string): val is EntityRectBehavior.Key =>
    val in EntityRectBehavior
}
