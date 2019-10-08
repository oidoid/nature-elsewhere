import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Layer} from '../image/Layer'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdaterType} from '../updaters/updaterType/UpdaterType'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

enum Variant {
  MEDIUM = 'medium',
  LARGE = 'large'
}

enum State {
  NONE = 'none',
  DRIZZLE = 'drizzle',
  SHOWER = 'shower',
  DOWNPOUR = 'downpour'
}

export class Cloud extends Entity<Variant, State> {
  static Variant = Variant
  static State = State
  protected static _variants: readonly Variant[] = Object.freeze(
    Object.values(Variant)
  )

  constructor(atlas: Atlas, props?: Entity.SubProps<Variant, State>) {
    super({
      type: EntityType.SCENERY_CLOUD,
      variant: Variant.MEDIUM,
      state: State.NONE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [State.NONE]: new ImageRect({
          images: variantImages(
            atlas,
            (props && props.variant) || Variant.MEDIUM
          )
        }),
        [State.DRIZZLE]: new ImageRect({
          images: [
            ...variantImages(atlas, (props && props.variant) || Variant.MEDIUM),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_SPRINKLE,
              position: new XY(2, 2),
              size: new WH(5, 32), // todo: no way to specify just width
              wrapVelocity: new XY(0, 225)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN,
              position: new XY(2, 6),
              size: new WH(7, 32),
              wrap: new XY(0, 8),
              wrapVelocity: new XY(0, 340)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_SPLASH,
              position: new XY(0, 35)
            })
          ]
        }),
        [State.SHOWER]: new ImageRect({
          images: [
            ...variantImages(atlas, (props && props.variant) || Variant.MEDIUM),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_SPRINKLE,
              position: new XY(2, 6),
              size: new WH(7, 32), // todo: no way to specify just width
              wrapVelocity: new XY(0, 300)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN,
              position: new XY(2, 2),
              size: new WH(7, 32),
              wrapVelocity: new XY(0, 337)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_SPLASH,
              position: new XY(0, 35)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN,
              position: new XY(2, 2),
              size: new WH(7, 32),
              wrapVelocity: new XY(0, 225)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_PUDDLE,
              position: new XY(2, 36),
              layer: Layer.DECAL,
              size: new WH(5, 3),
              wrapVelocity: new XY(-44, 22)
            }),
            new Image(atlas, {
              id: AtlasID.PALETTE_GREEN,
              position: new XY(1, 37),
              layer: Layer.DECAL,
              size: new WH(7, 1)
            })
          ]
        }),
        [State.DOWNPOUR]: new ImageRect({
          images: [
            ...variantImages(atlas, (props && props.variant) || Variant.MEDIUM),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_SPRINKLE,
              position: new XY(1, 6),
              size: new WH(9, 32), // todo: no way to specify just width
              wrapVelocity: new XY(0, 323)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN,
              position: new XY(2, 6),
              size: new WH(8, 32),
              wrap: new XY(0, 12),
              wrapVelocity: new XY(0, 398)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_PUDDLE,
              position: new XY(2, 35),
              layer: Layer.DECAL,
              size: new WH(7, 5),
              wrapVelocity: new XY(8, 215)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_PUDDLE,
              position: new XY(0, 37),
              layer: Layer.DECAL,
              size: new WH(11, 1),
              wrapVelocity: new XY(-90, 0)
            }),
            new Image(atlas, {
              id: AtlasID.SCENERY_CLOUD_RAIN_SPRINKLE,
              position: new XY(2, 6),
              size: new WH(8, 32), // todo: no way to specify just width
              wrapVelocity: new XY(0, 368)
            })
          ]
        })
      },
      updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
      updaters: [UpdaterType.WRAPAROUND],
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

function variantImages(atlas: Atlas, variant: Variant): Image[] {
  if (variant === Variant.MEDIUM)
    return [
      new Image(atlas, {
        id: AtlasID.SCENERY_CLOUD_MEDIUM,
        layer: Layer.FLOATS
      }),
      new Image(atlas, {
        id: AtlasID.SCENERY_CLOUD_MEDIUM_SHADOW,
        position: new XY(0, 32),
        layer: Layer.SHADOW
      })
    ]

  return [
    new Image(atlas, {
      id: AtlasID.SCENERY_CLOUD_LARGE,
      layer: Layer.FLOATS
    }),
    new Image(atlas, {
      id: AtlasID.SCENERY_CLOUD_LARGE_SHADOW,
      position: new XY(0, 32),
      layer: Layer.SHADOW
    })
  ]
}
