import * as xy from '../math/xy'
import {Image} from './image'
import {Palette} from './palette'

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
    if (xy.equal(this._origin, target)) return
    this.moveBy(xy.sub(target, this._origin))
  }
  moveBy(offset: XY): void {
    this._origin = xy.add(offset, this._origin)
    this._images.forEach(image => image.moveBy(offset))
    this.invalidate()
  }
  centerOn(target: Rect): void {
    this.moveTo({
      x: target.x + target.w / 2 - this._target.w / 2,
      y: this._origin.y
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
