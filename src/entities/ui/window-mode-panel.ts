import * as strings from '../../assets/strings.json'
import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'
import {ObjectUtil} from '../../utils/object-util'
import {Panel} from './panel'
import {SlideSwitch} from './slide-switch'
import {WindowModeSetting} from '../../settings/window-mode-setting'

const SwitchOffset: Readonly<
  Record<WindowModeSetting, number>
> = ObjectUtil.freeze({
  [WindowModeSetting.FULLSCREEN]: 27,
  [WindowModeSetting.WINDOWED]: 0
})

export class WindowModePanel {
  private readonly _switch: SlideSwitch
  private readonly _images: readonly Image[]
  constructor(atlas: Atlas.Definition, layer: number, target: XY) {
    this._switch = new SlideSwitch(atlas, layer + 4, 28)
    this._switch.switch(SwitchOffset[WindowModeSetting.FULLSCREEN])
    this._images = Image.moveBy(target, [
      ...Panel.create(atlas, strings['ui/settings/window-mode/title'], layer, {
        ...target,
        w: 59,
        h: 41
      }),
      Image.new(atlas, AnimationID.UI_WINDOW_MODE_CHART, {
        position: {x: 6, y: 7},
        layer: layer + 3
      }),
      ...Image.moveBy({x: 14, y: 26}, this._switch.images())
    ])
  }

  images(): readonly Image[] {
    return this._images
  }
}
