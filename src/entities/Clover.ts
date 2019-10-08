import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {Layer} from '../image/Layer'
import {XY} from '../math/XY'

export class Clover extends Entity<Clover.Variant, Clover.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Clover.Variant, Clover.State>
  ) {
    super({
      type: EntityType.SCENERY_CLOVER,
      variant: Clover.Variant.SMALL,
      state: Clover.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Clover.State.VISIBLE]: new ImageRect({
          images: variantImages(
            atlas,
            (props && props.variant) || Clover.Variant.SMALL
          )
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export namespace Clover {
  export enum Variant {
    SMALL = 'small',
    MEDIUM = 'medium'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

function variantImages(atlas: Atlas, variant: Clover.Variant): Image[] {
  if (variant === Clover.Variant.SMALL)
    return [
      new Image(atlas, {id: AtlasID.SCENERY_CLOVER_0x0, layer: Layer.DECAL}),
      new Image(atlas, {
        id: AtlasID.SCENERY_CLOVER_0x1,
        position: new XY(1, 3),
        layer: Layer.DECAL
      }),
      new Image(atlas, {
        id: AtlasID.SCENERY_CLOVER_0x0,
        position: new XY(4, 1),
        layer: Layer.DECAL
      })
    ]
  return [
    new Image(atlas, {id: AtlasID.SCENERY_CLOVER_1x0, layer: Layer.DECAL}),
    new Image(atlas, {
      id: AtlasID.SCENERY_CLOVER_0x1,
      position: new XY(1, 3),
      layer: Layer.DECAL
    }),
    new Image(atlas, {
      id: AtlasID.SCENERY_CLOVER_1x0,
      position: new XY(4, 1),
      layer: Layer.DECAL
    })
  ]
}
