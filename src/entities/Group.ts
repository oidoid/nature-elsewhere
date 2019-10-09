import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSON} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class Group extends Entity<Group.Variant, Group.State> {
  constructor(props?: Entity.SubProps<Group.Variant, Group.State>) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Group.State.VISIBLE]: new ImageRect()
      },
      ...props
    })
  }

  toJSON(): JSON {
    return this._toJSON(defaults)
  }
}

export namespace Group {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.GROUP,
  variant: Group.Variant.NONE,
  state: Group.State.VISIBLE
})
