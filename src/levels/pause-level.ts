import * as strings from '../assets/strings.json'
import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {InputBit} from '../inputs/input-bit'
import {Limits} from '../math/limits'
import {Palette} from '../images/palette'
import {Recorder} from '../inputs/recorder.js'
import {Rect} from '../math/rect'
import {Store} from '../entities/store'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'

export class PauseLevel implements Level {
  private readonly _store: Store
  private readonly _ui: ImageGroup
  constructor(
    shaderLayout: ShaderLayout,
    atlas: Atlas.Definition,
    private readonly _recorder: Recorder,
    private readonly _level: Level
  ) {
    this._store = new Store(shaderLayout, atlas)
    this._store.addImages(
      Image.new(atlas, AnimationID.PIXEL, {
        palette: Palette.YELLOWS,
        preScale: Limits.MAX_XY
      })
    )

    const title = Text.toImages(atlas, strings['ui/paused/title'], {
      scale: {x: 4, y: 4}
    })
    Image.moveBy({x: 0, y: 4}, title)

    this._ui = new ImageGroup(title)

    this._store.addImages(...this._ui.images())
  }

  scale(canvas: WH) {
    return Viewport.scale(
      canvas,
      Rect.add(this._ui.target(), {x: 0, y: 0, w: 16, h: 16}),
      0
    )
  }

  update(then: number, now: number, _canvas: WH, cam: Rect): LevelUpdate {
    this._ui.centerOn(cam)

    const nextLevel = this._recorder.triggered(InputBit.MENU)
      ? this._level
      : this
    return {nextLevel, ...this._store.update(now - then, cam)}
  }
}
