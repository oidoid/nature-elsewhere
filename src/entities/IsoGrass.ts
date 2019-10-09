import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {JSON} from '../utils/JSON'
import {ObjectUtil} from '../utils/ObjectUtil'

export class IsoGrass extends Entity<IsoGrass.Variant, IsoGrass.State> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<IsoGrass.Variant, IsoGrass.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [IsoGrass.State.NE]: new ImageRect({
          images: [new Image(atlas, {id: AtlasID.SCENERY_ISO_GRASS})]
        })
      },
      ...props
    })
  }

  toJSON(): JSON {
    return this._toJSON(defaults)
  }
}

export namespace IsoGrass {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NE = 'ne'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.SCENERY_ISO_GRASS,
  variant: IsoGrass.Variant.NONE,
  state: IsoGrass.State.NE,
  collisionType: CollisionType.TYPE_SCENERY
})
