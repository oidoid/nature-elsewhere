import {LevelType} from '../../../levels/level-type/level-type'
import {Entity} from '../../entity/entity'

export interface LevelLink {
  readonly link: LevelType
}

export namespace LevelLink {
  export function is(entity: Entity): entity is LevelLink & Entity {
    return 'link' in entity
  }
}
