import * as strings from '../../assets/strings.json'
import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'
import {ObjectUtil} from '../../utils/object-util'
import {Panel} from './panel'
import {SlideSwitch} from './slide-switch'
import {ZoomMultiplierSetting} from '../../settings/zoom-multiplier-setting'

const SwitchOffset: Readonly<
  Record<ZoomMultiplierSetting, number>
> = ObjectUtil.freeze({
  [ZoomMultiplierSetting.MAX]: 32,
  [ZoomMultiplierSetting.HALF]: 16,
  [ZoomMultiplierSetting.MIN]: 0
})

export class ZoomMultiplierPanel {
  private readonly _switch: SlideSwitch
  private readonly _images: ReadonlyArray<Image>
  constructor(
    atlas: Atlas.Definition,
    layer: number, // layer +5
    target: XY
  ) {
    this._switch = new SlideSwitch(atlas, layer + 4, 33)
    this._switch.switch(SwitchOffset[ZoomMultiplierSetting.MAX])
    this._images = Image.moveBy(target, [
      ...Panel.create(
        atlas,
        strings['ui/settings/zoom-multiplier/title'],
        layer,
        {
          ...target,
          w: 53,
          h: 41
        }
      ),
      Image.new(atlas, AnimationID.UI_ZOOM_MULTIPLIER_CHART, {
        position: {x: 9, y: 6},
        layer: layer + 3
      }),
      ...Image.moveBy({x: 8, y: 26}, this._switch.images())
    ])
  }

  images(): ReadonlyArray<Image> {
    return this._images
  }
}
