import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'

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
