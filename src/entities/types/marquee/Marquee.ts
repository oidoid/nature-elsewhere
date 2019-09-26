import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

export interface Marquee extends Entity {
  readonly type: EntityType.UI_MARQUEE
  selection?: Symbol
}

export namespace Marquee {
  export enum State {
    VISIBLE = 'visible'
  }
}
