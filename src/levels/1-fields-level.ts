import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {GrassTile} from '../entities/tiles/grass-tile'
import {Image} from '../images/image'
import {InputBit} from '../inputs/input-bit'
import {Limits} from '../math/limits'
import {Palette} from '../images/palette'
import {PauseLevel} from './pause-level'
import {Random} from '../math/random'
import {Recorder} from '../inputs/recorder'
import {Store} from '../entities/store'
import {ArrayUtil} from '../utils/array-util'

//   _______ _______
//  /      //      /
// /______//______/
export class FieldsLevel implements Level {
  private readonly _scale: number = 9
  private readonly _store: Store
  constructor(
    private _atlas: Atlas.Definition,
    private _recorder: Recorder,
    random: Random
  ) {
    this._store = new Store(_atlas)
    this._store.addImages(
      Image.new(_atlas, AnimationID.TILE_GRASS, {
        palette: Palette.GRASS_GREENS,
        wh: Limits.MAX_WH
      }),
      ...ArrayUtil.range(0, 1).reduce(
        (sum: readonly Image[], i) => [
          ...sum,
          ...Image.moveBy(
            {x: (i % 32) * 32, y: Math.trunc(i / 32) * 32},
            GrassTile.create(_atlas, 4, {w: 32, h: 32}, random)
          )
        ],
        []
      )
    )
    console.log(this._store)
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
