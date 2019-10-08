import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {XY} from '../math/XY'

export class Grass extends Entity<Grass.Variant, Grass.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Grass.Variant, Grass.State>
  ) {
    super({
      type: EntityType.SCENERY_GRASS,
      variant: Grass.Variant.SMALL,
      state: Grass.State.VISIBLE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Grass.State.VISIBLE]: new ImageRect({
          images: variantImages(
            atlas,
            (props && props.variant) || Grass.Variant.SMALL
          )
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export namespace Grass {
  export enum Variant {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

function variantImages(atlas: Atlas, variant: Grass.Variant): Image[] {
  if (variant === Grass.Variant.SMALL)
    return [new Image(atlas, {id: AtlasID.SCENERY_GRASS_0})]

  if (variant === Grass.Variant.MEDIUM)
    return [
      new Image(atlas, {id: AtlasID.SCENERY_GRASS_1}),
      new Image(atlas, {
        id: AtlasID.SCENERY_GRASS_3,
        position: new XY(4, 1)
      })
    ]

  return [
    new Image(atlas, {id: AtlasID.SCENERY_GRASS_2}),
    new Image(atlas, {
      id: AtlasID.SCENERY_GRASS_0,
      position: new XY(6, 2)
    }),
    new Image(atlas, {
      id: AtlasID.SCENERY_GRASS_1,
      position: new XY(3, 3)
    })
  ]
}
