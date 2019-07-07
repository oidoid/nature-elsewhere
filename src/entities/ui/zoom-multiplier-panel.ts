import * as strings from '../../assets/strings.json'
import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'
import {Layer} from '../../images/layer'
import {Panel} from './panel'
import {SlideSwitch} from './slide-switch'
import {ZoomMultiplierSetting} from '../../settings/zoom-multiplier-setting'

const SwitchOffset: Readonly<
  Record<ZoomMultiplierSetting, number>
> = Object.freeze({
  [ZoomMultiplierSetting.MAX]: 32,
  [ZoomMultiplierSetting.HALF]: 16,
  [ZoomMultiplierSetting.MIN]: 0
})

export class ZoomMultiplierPanel {
  private readonly _switch: SlideSwitch
  private readonly _images: readonly Image[]
  constructor(atlas: Atlas.Definition, target: XY) {
    this._switch = new SlideSwitch(atlas, 33)
    this._switch.switch(SwitchOffset[ZoomMultiplierSetting.MAX])
    this._images = Image.moveBy(target, [
      ...Panel.create(atlas, strings['ui/settings/zoom-multiplier/title'], {
        ...target,
        w: 53,
        h: 41
      }),
      Image.new(atlas, AnimationID.UI_ZOOM_MULTIPLIER_CHART, {
        position: {x: 9, y: 6},
        layer: Layer.UI_HI
      }),
      ...Image.moveBy({x: 8, y: 26}, this._switch.images())
    ])
  }

  images(): readonly Image[] {
    return this._images
  }
}
