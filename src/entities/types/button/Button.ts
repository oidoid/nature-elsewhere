import {Entity} from '../../entity/Entity'
import {EntityType} from '../../entityType/EntityType'

export interface Button extends Entity {
  readonly type: EntityType.UI_BUTTON
  clicked: boolean
  longClicked: boolean
}

export namespace Button {
  export enum State {
    UNCLICKED = 'unclicked',
    CLICKED = 'clicked'
  }
}
