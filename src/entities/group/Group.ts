import {Entity} from '../../entity/Entity'
import {EntityConfig} from '../../entity/EntityConfig'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {FollowCam} from '../../updaters/FollowCam'
import {SpriteRect} from '../../spriteStateMachine/SpriteRect'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/UpdateStatus'
import {WH} from '../../math/WH'

export class Group extends Entity<Group.Variant, Group.State> {
  private readonly _followCam: FollowCam

  constructor(props?: Group.Props) {
    super({
      ...defaults,
      map: {[Group.State.NONE]: new SpriteRect()},
      ...props
    })
    this._followCam = {
      positionRelativeToCam:
        props?.positionRelativeToCam ?? defaults.positionRelativeToCam,
      camMargin: props?.camMargin ?? defaults.camMargin.copy()
    }
  }

  update(state: UpdateState): UpdateStatus {
    return super.update(state) | FollowCam.update(this._followCam, this, state)
  }

  toJSON(): EntityConfig {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Group {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }

  export interface Props
    extends Entity.SubProps<Group.Variant, Group.State>,
      Partial<FollowCam> {}
}

const defaults = Object.freeze({
  type: EntityType.GROUP,
  variant: Group.Variant.NONE,
  state: Group.State.NONE,
  positionRelativeToCam: undefined,
  camMargin: Object.freeze(new WH(0, 0))
})
