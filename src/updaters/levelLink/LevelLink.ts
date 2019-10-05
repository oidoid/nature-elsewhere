import {LevelType} from '../../levels/LevelType'
import {Entity} from '../../entity/Entity'

export interface LevelLink {
  readonly link: LevelType
}

export namespace LevelLink {
  export function is(entity: Entity): entity is LevelLink & Entity {
    return 'link' in entity
  }
}
