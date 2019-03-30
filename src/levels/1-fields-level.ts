import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {InputBit} from '../inputs/input-bit'
import {Limits} from '../math/limits'
import {Palette} from '../images/palette'
import {Store} from '../entities/store'
import {PauseLevel} from './pause-level'
import {Recorder} from '../inputs/recorder'

export class FieldsLevel implements Level {
  private readonly _scale: number = 9
  private readonly _store: Store
  constructor(private _atlas: Atlas.Definition, private _recorder: Recorder) {
    this._store = new Store(_atlas)
    this._store.addImages(
      Image.new(_atlas, AnimationID.PIXEL, {
        palette: Palette.YELLOWS,
        preScale: Limits.MAX_XY
      }),
      Image.new(_atlas, AnimationID.TREE, {
        palette: Palette.TREE,
        layer: 1,
        position: {x: 120, y: 4}
      }),
      Image.new(_atlas, AnimationID.GRASS_L, {
        palette: Palette.GREENS,
        layer: 1,
        position: {x: -1024, y: 31},
        preScale: {x: 100, y: 100}
      })
    )
  }

  scale() {
    return this._scale
  }

  update(then: number, now: number, _canvas: WH, cam: Rect): LevelUpdate {
    const nextLevel = this._recorder.triggered(InputBit.MENU)
      ? new PauseLevel(this._atlas, this._recorder, this)
      : this
    return {nextLevel, ...this._store.update(now - then, cam)}
  }
}
