import {Atlas} from '../../images/atlas'
import {AnimationID} from '../../images/animation-id'
import {Image} from '../../images/image'
import {ImageGroup} from '../../images/image-group'
import {Palette} from '../../images/palette'
import {XY} from '../../math/xy'

export class VirtualJoystick {
  private readonly _base: Image
  private readonly _stick: Image
  private readonly _images: ImageGroup
  private readonly _radiusPx: number

  constructor(atlas: Atlas.Definition, layer: number) {
    this._base = Image.new(atlas, AnimationID.UI_VIRTUAL_JOYSTICK_BASE, {
      palette: Palette.GREYS,
      layer
    })
    this._stick = Image.new(atlas, AnimationID.UI_VIRTUAL_JOYSTICK_STICK, {
      palette: Palette.GREYS,
      layer: layer + 1
    })
    this._images = new ImageGroup([this._base, this._stick])
    this._radiusPx = Math.min(this._base.target().w, this._base.target().h) / 2
  }

  setPosition(position: XY): void {
    this._images.moveTo(XY.add(position, -this._radiusPx))
  }

  centerStick(): void {
    this.setStick({x: 0, y: 0}, 0)
  }

  setStick(normal: XY, magnitude: number): void {
    const length = Math.min(this._radiusPx, magnitude)
    const target = XY.trunc(XY.mul(normal, length))
    this._stick.moveTo(XY.add(target, this._base.target()))
  }

  // update (reset hidden timer, set new origin)

  images(): ReadonlyArray<Image> {
    return this._images.images()
  }
}
