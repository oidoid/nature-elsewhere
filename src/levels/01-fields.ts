import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {Limits} from '../math/limits'
import {Palette} from '../images/palette'
import {Store} from '../entities/store'

export class Fields implements Level {
  private readonly _scale: number = 9
  private readonly _store: Store
  constructor(atlas: Atlas.Definition) {
    this._store = new Store(atlas)
    this._store.addImages(
      Image.new(atlas, AnimationID.PIXEL, Palette.YELLOWS, {
        preScale: Limits.MAX_XY
      }),
      Image.new(atlas, AnimationID.TREE, Palette.TREE, {
        layer: 1,
        position: {x: 120, y: 4}
      }),
      Image.new(atlas, AnimationID.GRASS_L, Palette.GREENS, {
        layer: 1,
        position: {x: -1024, y: 31},
        preScale: {x: 100, y: 100}
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
