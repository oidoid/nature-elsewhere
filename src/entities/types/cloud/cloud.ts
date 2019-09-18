import {Entity} from '../../entity/entity'
import {EntityType} from '../../entity-type/entity-type'
import {EntityState} from '../../entity-state/entity-state'

export interface Cloud extends Entity {
  readonly type: EntityType.SCENERY_CLOUD
  state: Cloud.Precipitation | EntityState
}

export namespace Cloud {
  export enum Precipitation {
    NONE = 'none',
    DRIZZLE = 'drizzle',
    SHOWER = 'shower',
    DOWNPOUR = 'downpour'
  }
}
