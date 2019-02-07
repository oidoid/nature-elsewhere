import * as limits from '../math/limits'
import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'
import {Store} from '../entities/store'

export class Fields implements Level {
  private readonly _scale: number = 9
  private readonly _store: Store
  constructor(atlas: AtlasDefinition) {
    this._store = new Store(atlas)
    this._store.addImages(
      Image.new(atlas, AnimationID.PALETTE_PALE_GREEN, {
        preScale: limits.MAX_XY
      })
    )
  }

  scale() {
    return this._scale
  }

  update(then: number, now: number, cam: Rect): LevelUpdate {
    return {nextLevel: this, ...this._store.update(now - then, cam)}
  }
}
