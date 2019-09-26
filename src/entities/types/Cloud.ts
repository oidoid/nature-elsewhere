import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'

export interface Cloud extends Entity {
  readonly type: EntityType.SCENERY_CLOUD
}

export namespace Cloud {
  export enum State {
    NONE = 'none',
    DRIZZLE = 'drizzle',
    SHOWER = 'shower',
    DOWNPOUR = 'downpour'
  }
}
