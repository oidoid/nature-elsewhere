import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {BorderBox} from './border-box'
import {Image} from '../../images/image'
import {NumberUtil} from '../../math/number-util'
import {Palette, Tone} from '../../images/palette'

export class SlideSwitch {
  private readonly _switch: Image
  private readonly _images: readonly Image[]
  constructor(
    atlas: Atlas.Definition,
    layer: number,
    private readonly _width: number // Width not including border.
  ) {
    this._switch = Image.new(atlas, AnimationID.UI_SWITCH, {
      palette: Palette.GREYS,
      layer: layer + 2
    })
    this._images = [
      ...Image.moveBy(
        {x: 1, y: 5},
        BorderBox.create(
          atlas,
          Palette.GREYS + Tone.HALF,
          BorderBox.Border.SOLID,
          Palette.GREYS,
          layer,
          {w: _width, h: 1}
        )
      ),
      this._switch
    ]
  }

  images(): readonly Image[] {
    return this._images
  }

  switch(offset: number): void {
    this._switch.moveTo({x: NumberUtil.clamp(offset, 0, this._width - 1), y: 0})
  }
}
