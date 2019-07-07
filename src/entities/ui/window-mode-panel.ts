import * as strings from '../../assets/strings.json'
import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'
import {Layer} from '../../images/layer'
import {Panel} from './panel'
import {SlideSwitch} from './slide-switch'
import {WindowModeSetting} from '../../settings/window-mode-setting'

const SwitchOffset: Readonly<Record<WindowModeSetting, number>> = Object.freeze(
  {
    [WindowModeSetting.FULLSCREEN]: 28,
    [WindowModeSetting.WINDOWED]: 0
  }
)

export class WindowModePanel {
  private readonly _switch: SlideSwitch
  private readonly _images: readonly Image[]
  constructor(atlas: Atlas.Definition, target: XY) {
    this._switch = new SlideSwitch(atlas, 29)
    this._switch.switch(SwitchOffset[WindowModeSetting.FULLSCREEN])
    this._images = Image.moveBy(target, [
      ...Panel.create(atlas, strings['ui/settings/window-mode/title'], {
        ...target,
        w: 59,
        h: 43
      }),
      Image.new(atlas, AnimationID.UI_WINDOW_MODE_CHART, {
        position: {x: 6, y: 7},
        layer: Layer.UI_HI
      }),
      ...Image.moveBy({x: 14, y: 30}, this._switch.images())
    ])
  }

  images(): readonly Image[] {
    return this._images
  }
}
