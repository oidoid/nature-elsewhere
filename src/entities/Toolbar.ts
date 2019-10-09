import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {FollowCamOrientation, FollowCam} from '../updaters/followCam/FollowCam'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {WH} from '../math/WH'
import {XY} from '../math/XY'
import {FollowCamUpdater} from '../updaters/followCam/FollowCamUpdater'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {UpdateState} from '../updaters/UpdateState'

export class Toolbar extends Entity<Toolbar.Variant, Toolbar.State>
  implements FollowCam {
  readonly positionRelativeToCam: FollowCamOrientation
  readonly camMargin: WH

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
            new Image(atlas, {id: AtlasID.SCENERY_FLAG, layer: Layer.UI_HI}),
            new Image(atlas, {
              id: AtlasID.SCENERY_FLAG,
              position: new XY(4, 0),
              layer: Layer.UI_HI
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_FLAG,
              position: new XY(8, 0),
              layer: Layer.UI_HI
            }),
            new Image(atlas, {
              id: AtlasID.CHAR_ARROW_DIAGONAL,
              position: new XY(12, 0),
              layer: Layer.UI_HI
            })
          ]
        })
      },
      ...props
    })
    this.positionRelativeToCam = FollowCamOrientation.SOUTH_WEST
    this.camMargin = new WH(1, 1)
  }

  update(state: UpdateState): UpdateStatus {
    return super.update(state) | FollowCamUpdater.update(this, state)
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
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
