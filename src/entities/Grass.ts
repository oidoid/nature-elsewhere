import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Layer} from '../image/Layer'

export class Grass extends Entity<Grass.Variant, Grass.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Grass.Variant, Grass.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Grass.State.VISIBLE]: new ImageRect({
          images: [
            new Image(atlas, {
              id:
                AtlasID[
                  <keyof typeof AtlasID>(
                    ('GRASS_' + (props?.variant ?? defaults.variant))
                  )
                ]
            }),
            new Image(atlas, {id: AtlasID.GRASS_SHADOW, layer: Layer.SHADOW})
          ]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Grass {
  export enum Variant {
    N00 = '00',
    N01 = '01',
    N02 = '02',
    N03 = '03',
    N04 = '04',
    N05 = '05',
    N06 = '06',
    N07 = '07',
    N08 = '08',
    N09 = '09',
    N10 = '10',
    N11 = '11',
    N12 = '12',
    N13 = '13',
    N14 = '14',
    N15 = '15'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.GRASS,
  variant: Grass.Variant.N00,
  state: Grass.State.VISIBLE,
  collisionType: CollisionType.TYPE_SCENERY
})
console.log(defaults.variant)
