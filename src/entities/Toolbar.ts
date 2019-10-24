import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {Button} from './Button'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Compartment} from './Compartment'
import {Cursor} from './cursor/Cursor'
import {Entity} from '../entity/Entity'
import {EntityCollider} from '../collision/EntityCollider'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {FollowCam} from '../updaters/FollowCam'
import {Group} from './group/Group'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {LifeCounter} from './LifeCounter'
import {Limits} from '../math/Limits'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {WH} from '../math/WH'

// This entity is fixed at (0,0) and has the width and height from there to
// wherever the child groups are rendererd, which is usually a significant
// portion of the level.
export class Toolbar extends Entity<Toolbar.Variant, Toolbar.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Toolbar.Variant, Toolbar.State>
  ) {
    super({
      ...defaults,
      map: {[Toolbar.State.VISIBLE]: new SpriteRect()},
      children: [
        new Group({
          positionRelativeToCam: FollowCam.Orientation.NORTH_EAST,
          camMargin: new WH(0, 3),
          collisionPredicate: CollisionPredicate.CHILDREN,
          children: [
            new Compartment(atlas),
            new Button(atlas, {
              y: 40,
              map: {
                [Button.State.UNCLICKED]: new SpriteRect({
                  sprites: [
                    Sprite.withAtlasSize(atlas, {
                      id: AtlasID.MELEE_BUTTON_DISABLED,
                      layer: Layer.UI_MID
                    })
                  ]
                }),
                [Button.State.CLICKED]: new SpriteRect({
                  sprites: [
                    Sprite.withAtlasSize(atlas, {
                      id: AtlasID.MELEE_BUTTON_ENABLED,
                      layer: Layer.UI_HI
                    })
                  ]
                })
              }
            })
          ]
        }),
        new Group({
          positionRelativeToCam: FollowCam.Orientation.SOUTH_WEST,
          collisionPredicate:
            CollisionPredicate.CHILDREN | CollisionPredicate.SPRITES,
          map: {
            [Group.State.VISIBLE]: new SpriteRect({
              sprites: [
                Sprite.withAtlasSize(atlas, {
                  id: AtlasID.ROSE_BAUBLE,
                  layer: Layer.UI_HI
                }),
                Sprite.withAtlasSize(atlas, {
                  id: AtlasID.HEALTH_BAUBLE,
                  y: 30,
                  layer: Layer.UI_HI
                })
              ]
            })
          },
          children: [new LifeCounter(atlas, {x: 18, y: 20})]
        })
      ],
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    const collision = EntityCollider.collidesEntity(state.level.cursor, this)
    if (collision.length) {
      status |= state.level.cursor.setIcon(state.level.atlas, Cursor.Icon.HAND)
      status |= this.collides(collision, state)
    } else
      status |= state.level.cursor.setIcon(
        state.level.atlas,
        Cursor.Icon.RETICLE
      )
    return status
  }

  invalidateBounds(): void {
    this._bounds.size.w = Limits.maxShort
    this._bounds.size.h = Limits.maxShort
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

const defaults = Object.freeze({
  type: EntityType.UI_TOOLBAR,
  variant: Toolbar.Variant.NONE,
  state: Toolbar.State.VISIBLE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.CHILDREN,
  collisionType: CollisionType.TYPE_UI
})
