import {Entity} from '../../entity/Entity'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {FollowCam} from '../../updaters/followCam/FollowCam'
import {ImageRect} from '../../imageStateMachine/ImageRect'
import {JSONValue} from '../../utils/JSON'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {WH} from '../../math/WH'

export class Group extends Entity<Group.Variant, Group.State> {
  private readonly _followCam: FollowCam

  constructor(props?: Group.Props) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Group.State.VISIBLE]: new ImageRect()
      },
      ...props
    })
    this._followCam = {
      positionRelativeToCam:
        props?.positionRelativeToCam ?? defaults.positionRelativeToCam,
      camMargin: props?.camMargin ?? defaults.camMargin.copy()
    }
  }

  update(state: UpdateState): UpdateStatus {
    let status =
      super.update(state) | FollowCam.update(this._followCam, this, state)
    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Group {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }

  export interface Props
    extends Entity.SubProps<Group.Variant, Group.State>,
      Partial<FollowCam> {}
}

const defaults = ObjectUtil.freeze({
  type: EntityType.GROUP,
  variant: Group.Variant.NONE,
  state: Group.State.VISIBLE,
  positionRelativeToCam: undefined,
  camMargin: new WH(0, 0)
})
