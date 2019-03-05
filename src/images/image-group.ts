import {Image} from './image'
import {Palette} from './palette'
import {XY} from '../math/xy'

// A proxy with caching for keeping and manipulating multiple images relative an
// origin.
export class ImageGroup {
  private _origin: Mutable<XY> = {x: 0, y: 0}
  private _target: Rect = {x: 0, y: 0, w: 0, h: 0}
  constructor(private readonly _images: ReadonlyArray<Image>) {
    this.invalidate()
  }
  images(): ReadonlyArray<Image> {
    return this._images
  }
  moveTo(target: XY): void {
    if (XY.equal(this._origin, target)) return
    this.moveBy(XY.sub(target, this._origin))
  }
  moveBy(offset: XY): void {
    this._origin = XY.add(offset, this._origin)
    this._images.forEach(image => image.moveBy(offset))
    this.invalidate()
  }
  centerOn(target: Rect): void {
    this.moveTo({
      x: Math.trunc(target.x + target.w / 2) - Math.trunc(this._target.w / 2),
      y: Math.trunc(target.y + target.h / 2) - Math.trunc(this._target.h / 2)
    })
  }
  target(): Rect {
    return this._target
  }
  setPalette(palette: Palette): void {
    Image.setPalette(palette, this._images)
  }
  private invalidate(): void {
    this._target = Image.target(this._images)
  }
}
