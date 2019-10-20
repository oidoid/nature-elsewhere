import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {UpdatePredicate} from '../updaters/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {Wraparound} from '../updaters/Wraparound'

export class Cloud extends Entity<Cloud.Variant, Cloud.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Cloud.Variant, Cloud.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Cloud.State.NONE]: new ImageRect({
          images: variantImages(atlas, props?.variant ?? Cloud.Variant.MEDIUM)
        }),
        [Cloud.State.DRIZZLE]: new ImageRect({
          images: [
            ...variantImages(atlas, props?.variant ?? Cloud.Variant.MEDIUM),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN_SPRINKLE,
              x: 2,
              y: 2,
              w: 5,
              wvy: 225
            }),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN,
              x: 2,
              y: 6,
              w: 7,
              wy: 8,
              wvy: 340
            }),
            Image.new(atlas, {id: AtlasID.CLOUD_RAIN_SPLASH, y: 35})
          ]
        }),
        [Cloud.State.SHOWER]: new ImageRect({
          images: [
            ...variantImages(atlas, props?.variant ?? Cloud.Variant.MEDIUM),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN_SPRINKLE,
              x: 2,
              y: 6,
              w: 7,
              wvy: 300
            }),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN,
              x: 2,
              y: 2,
              w: 7,
              wvy: 337
            }),
            Image.new(atlas, {id: AtlasID.CLOUD_RAIN_SPLASH, y: 35}),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN,
              x: 2,
              y: 2,
              w: 7,
              wvy: 225
            }),
            new Image({
              id: AtlasID.CLOUD_RAIN_PUDDLE,
              x: 2,
              y: 36,
              layer: Layer.DECAL,
              w: 5,
              h: 3,
              wvx: -44,
              wvy: 22
            }),
            new Image({
              id: AtlasID.PALETTE_GREEN,
              x: 1,
              y: 37,
              layer: Layer.DECAL,
              w: 7,
              h: 1
            })
          ]
        }),
        [Cloud.State.DOWNPOUR]: new ImageRect({
          images: [
            ...variantImages(atlas, props?.variant ?? Cloud.Variant.MEDIUM),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN_SPRINKLE,
              x: 1,
              y: 6,
              w: 9,
              wvy: 323
            }),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN,
              x: 2,
              y: 6,
              w: 8,
              wy: 12,
              wvy: 398
            }),
            new Image({
              id: AtlasID.CLOUD_RAIN_PUDDLE,
              x: 2,
              y: 35,
              layer: Layer.DECAL,
              w: 7,
              h: 5,
              wvx: 8,
              wvy: 215
            }),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN_PUDDLE,
              y: 37,
              layer: Layer.DECAL,
              w: 11,
              h: 1,
              wvx: -90
            }),
            Image.new(atlas, {
              id: AtlasID.CLOUD_RAIN_SPRINKLE,
              x: 2,
              y: 6,
              w: 8,
              wvy: 368
            })
          ]
        })
      },
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    return super.update(state) | Wraparound.update(this, state)
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}
export namespace Cloud {
  export enum Variant {
    MEDIUM = 'medium',
    LARGE = 'large'
  }

  export enum State {
    NONE = 'none',
    DRIZZLE = 'drizzle',
    SHOWER = 'shower',
    DOWNPOUR = 'downpour'
  }
}

function variantImages(atlas: Atlas, variant: Cloud.Variant): Image[] {
  if (variant === Cloud.Variant.MEDIUM)
    return [
      Image.new(atlas, {id: AtlasID.CLOUD_MEDIUM, layer: Layer.FLOATS}),
      Image.new(atlas, {
        id: AtlasID.CLOUD_MEDIUM_SHADOW,
        y: 32,
        layer: Layer.SHADOW
      })
    ]

  return [
    Image.new(atlas, {id: AtlasID.CLOUD_LARGE, layer: Layer.FLOATS}),
    Image.new(atlas, {
      id: AtlasID.CLOUD_LARGE_SHADOW,
      y: 32,
      layer: Layer.SHADOW
    })
  ]
}

const defaults = Object.freeze({
  type: EntityType.CLOUD,
  variant: Cloud.Variant.MEDIUM,
  state: Cloud.State.NONE,
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.TYPE_SCENERY
})
