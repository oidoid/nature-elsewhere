import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {JSONValue} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

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
                    ('GRASS_' + ((props && props.variant) || defaults.variant))
                  )
                ]
            })
          ]
        })
      },
      ...props
    })
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
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
