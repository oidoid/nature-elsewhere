import * as strings from '../assets/strings.json'
import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Button} from '../entities/ui/button'
import {ControllerMappingPanel} from '../entities/ui/controller-mapping-panel'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {Limits} from '../math/limits'
import {Palette} from '../images/palette'
import {Rect} from '../math/rect'
import {Store} from '../entities/store'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'
import {WindowModePanel} from '../entities/ui/window-mode-panel'
import {ZoomMultiplierPanel} from '../entities/ui/zoom-multiplier-panel'

export class SettingsLevel implements Level {
  private readonly _store: Store
  private readonly _ui: ImageGroup
  constructor(atlas: Atlas.Definition) {
    this._store = new Store(atlas)
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
      ...new WindowModePanel(atlas, 10, {x: 0, y: 4 * 2 + 12}).images(),
      ...new ZoomMultiplierPanel(atlas, 10, {x: 69, y: 4 * 2 + 12}).images(),
      ...ControllerMappingPanel.create(atlas, 10, {
        x: 0,
        y: 4 * 2 + 12 + 43 + 8
      }),
      ...Image.moveBy(
        {x: 0, y: 4 * 2 + 12 + 43 + 8 + 79},
        Button.create(
          atlas,
          10 + 1,
          {w: 23, h: 12},
          strings['ui/settings/controller-mapping/save']
        )
      ),
      ...Image.moveBy(
        {x: 29, y: 4 * 2 + 12 + 43 + 8 + 79},
        Button.create(
          atlas,
          10 + 1,
          {w: 30, h: 12},
          strings['ui/settings/controller-mapping/cancel']
        )
      ),
      ...Image.moveBy(
        {x: 89, y: 4 * 2 + 12 + 43 + 8 + 79},
        Button.create(
          atlas,
          10 + 1,
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
      Rect.add(this._ui.target(), {x: 0, y: 0, w: 4, h: 4}),
      0
    )
  }

  update(then: number, now: number, cam: Rect): LevelUpdate {
    this._ui.centerOn(cam)
    return {nextLevel: this, ...this._store.update(now - then, cam)}
  }
}
