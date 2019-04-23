import {AnimationID} from '../images/animation-id'
import {ArrayUtil} from '../utils/array-util'
import {Atlas} from '../images/atlas'
import {FlowerTile} from '../entities/tiles/flower-tile'
import {GrassTile} from '../entities/tiles/grass-tile'
import {Image} from '../images/image'
import {InputBit} from '../inputs/input-bit'
import {LevelDefault} from './level-default'
import {Limits} from '../math/limits'
import {Palette} from '../images/palette'
import {PauseLevel} from './pause-level'
import {Random} from '../math/random'
import {Recorder} from '../inputs/recorder'
import {Store} from '../entities/store'
import {Viewport} from '../graphics/viewport'

//   _______ _______
//  /      //      /
// /______//______/
export class FieldsLevel implements Level {
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
      ...FlowerTile.create(_atlas, 4, {w: 1000, h: 1000}, random),
      ...ArrayUtil.range(0, 1000).reduce(
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

  scale(canvas: WH): number {
    return Viewport.scale(canvas, LevelDefault.minScreenSize, 0)
  }

  update(then: number, now: number, _canvas: WH, cam: Rect): LevelUpdate {
    const nextLevel = this._recorder.triggered(InputBit.MENU)
      ? new PauseLevel(this._atlas, this._recorder, this)
      : this
    return {nextLevel, ...this._store.update(now - then, cam)}
  }
}
