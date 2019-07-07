import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Button} from '../entities/ui/button'
import {ControllerMappingPanel} from '../entities/ui/controller-mapping-panel'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {InputBit} from '../inputs/input-bit'
import {Limits} from '../math/limits'
import {Palette} from '../images/palette'
import {Recorder} from '../inputs/recorder.js'
import {Rect} from '../math/rect'
import {Store} from '../store/store'
import * as strings from '../assets/strings.json'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'
import {WindowModePanel} from '../entities/ui/window-mode-panel'
import {ZoomMultiplierPanel} from '../entities/ui/zoom-multiplier-panel'

export class SettingsLevel implements Level {
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

    const title = Text.toImages(atlas, strings['ui/settings/title'], {
      scale: {x: 2, y: 2}
    })
    Image.moveBy({x: 0, y: 4}, title)

    this._ui = new ImageGroup([
      ...title,
      ...new WindowModePanel(atlas, {x: 0, y: 4 * 2 + 12}).images(),
      ...new ZoomMultiplierPanel(atlas, {x: 69, y: 4 * 2 + 12}).images(),
      ...ControllerMappingPanel.create(atlas, {
        x: 0,
        y: 4 * 2 + 12 + 43 + 8
      }),
      ...Image.moveBy(
        {x: 0, y: 4 * 2 + 12 + 43 + 8 + 79},
        Button.create(
          atlas,
          {w: 23, h: 12},
          strings['ui/settings/controller-mapping/save']
        )
      ),
      ...Image.moveBy(
        {x: 29, y: 4 * 2 + 12 + 43 + 8 + 79},
        Button.create(
          atlas,
          {w: 30, h: 12},
          strings['ui/settings/controller-mapping/cancel']
        )
      ),
      ...Image.moveBy(
        {x: 89, y: 4 * 2 + 12 + 43 + 8 + 79},
        Button.create(
          atlas,
          {w: 48, h: 12},
          strings['ui/settings/controller-mapping/set-defaults']
        )
      )
    ])

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

    const nextLevel = this._recorder.set(InputBit.MENU) ? this._level : this
    return {nextLevel, ...this._store.update(now - then, cam)}
  }
}
