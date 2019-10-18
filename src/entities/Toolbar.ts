import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {FollowCam} from '../updaters/FollowCam'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {WH} from '../math/WH'

export class Toolbar extends Entity<Toolbar.Variant, Toolbar.State> {
  private readonly _followCam: DeepImmutable<FollowCam>

  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Toolbar.Variant, Toolbar.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Toolbar.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {id: AtlasID.FLAG, layer: Layer.UI_HI}),
            new Image(atlas, {id: AtlasID.FLAG, x: 4, layer: Layer.UI_HI}),
            new Image(atlas, {id: AtlasID.FLAG, x: 8, layer: Layer.UI_HI}),
            new Image(atlas, {
              id: AtlasID.ARROW_DIAGONAL,
              x: 12,
              layer: Layer.UI_HI
            })
          ]
        })
      },
      ...props
    })
    this._followCam = ObjectUtil.freeze({
      positionRelativeToCam: FollowCam.Orientation.SOUTH_WEST,
      camMargin: new WH(1, 1)
    })
  }

  update(state: UpdateState): UpdateStatus {
    return super.update(state) | FollowCam.update(this._followCam, this, state)
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Toolbar {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_TOOLBAR,
  variant: Toolbar.Variant.NONE,
  state: Toolbar.State.VISIBLE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionType: CollisionType.TYPE_UI
})
