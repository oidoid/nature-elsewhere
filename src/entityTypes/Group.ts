import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'

export class Group extends Entity {
  constructor(props?: Omit<Entity.Props, 'type'>) {
    super({
      type: EntityType.GROUP,
      state: GroupState.VISIBLE,
      map: {
        [Entity.State.HIDDEN]: new ImageRect(),
        [GroupState.VISIBLE]: new ImageRect()
      },
      ...props
    })
  }
}

export enum GroupState {
  VISIBLE = 'visible'
}
