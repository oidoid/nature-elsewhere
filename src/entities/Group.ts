import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'

export class Group extends Entity<'none', Group.State> {
  constructor(props?: Entity.SubProps<'none', Group.State>) {
    super({
      type: EntityType.GROUP,
      variant: 'none',
      state: Group.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Group.State.VISIBLE]: new ImageRect()
      },
      ...props
    })
  }
}

export namespace Group {
  export enum State {
    VISIBLE = 'visible'
  }
}
