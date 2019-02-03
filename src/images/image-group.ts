import * as rect from '../math/rect'
import * as xy from '../math/xy'
import {Image} from './image'

// A proxy with caching for keeping and manipulating multiple images relative an
// origin.
export class ImageGroup {
  private _origin: Mutable<XY> = {x: 0, y: 0}
  private _target: Rect = {x: 0, y: 0, w: 0, h: 0}
  constructor(private readonly _images: ReadonlyArray<Image>) {
    this.invalidate()
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
  target() {
    return this._target
  }
  private invalidate() {
    this._target = this._images.reduce(
      (union, image) => rect.union(union, image.target()),
      (this._images[0] && this._images[0].target()) || {x: 0, y: 0, w: 0, h: 0}
    )
  }
}
