import {AnimationID} from '../../images/animation-id'
import {Atlas} from '../../images/atlas'
import {Image} from '../../images/image'
import {InputBit} from '../../inputs/input-bit'
import {ImageGroup} from '../../images/image-group'
import {InputSource} from '../../inputs/input-source'
import {Palette} from '../../images/palette'
import {Recorder} from '../../inputs/recorder'
import {VirtualJoystickPositionInput} from '../../inputs/pointers/virtual-gamepad-input'
import {XY} from '../../math/xy'

/** A HUD representation of the virtual joystick. */
export class VirtualJoystick {
  private static _maxIdleVisibility: number = 3072

  /** Duration in milliseconds since last stick update. */
  private _timer: number = 0
  private _image: VirtualJoystickImage

  constructor(atlas: Atlas.Definition, layer: number) {
    this._image = new VirtualJoystickImage(atlas, layer)
  }

  update(milliseconds: number, recorder: Recorder): void {
    this._timer += milliseconds

    const [set] = recorder.combo().slice(-1)

    if (recorder.triggeredSet(InputBit.POSITION_VIRTUAL_JOYSTICK)) {
      const position = set[InputSource.VIRTUAL_GAMEPAD_JOYSTICK_POSITION]
      const xy = (<VirtualJoystickPositionInput>position).xy
      this._image.setPosition(xy)
      this._timer = 0
    }

    const joystick = set && set[InputSource.VIRTUAL_GAMEPAD_JOYSTICK_AXES]
    if (joystick) {
      this._image.setStick(joystick.normal, joystick.magnitude)
      this._timer = 0
    } else this._image.setStick({x: 0, y: 0}, 0)
  }

  images(): ReadonlyArray<Image> {
    return this.hidden() ? [] : this._image.images()
  }

  private hidden() {
    return this._timer > VirtualJoystick._maxIdleVisibility
  }
}

class VirtualJoystickImage {
  private readonly _base: Image
  private readonly _stick: Image
  private readonly _images: ImageGroup
  private readonly _radiusPx: number

  constructor(atlas: Atlas.Definition, layer: number) {
    const palette = Palette.GREYS
    this._base = Image.new(atlas, AnimationID.UI_VIRTUAL_JOYSTICK_BASE, {
      palette,
      layer
    })
    this._stick = Image.new(atlas, AnimationID.UI_VIRTUAL_JOYSTICK_STICK, {
      palette,
      layer: layer + 1
    })
    this._images = new ImageGroup([this._base, this._stick])
    this._radiusPx = Math.min(this._base.target().w, this._base.target().h) / 2
  }

  images(): ReadonlyArray<Image> {
    return this._images.images()
  }

  setPosition(position: XY): void {
    this._images.moveTo(XY.add(position, -this._radiusPx))
  }

  setStick(normal: XY, magnitude: number): void {
    // This is the maximum length of freedom the stick is given.
    const length = Math.min(this._radiusPx, magnitude)
    const target = XY.trunc(XY.mul(normal, length))
    this._stick.moveTo(XY.add(target, this._base.target()))
  }
}
