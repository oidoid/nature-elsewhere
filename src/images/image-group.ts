import {Atlas} from './atlas'
import {Image} from './image'
import {Rect} from '../math/rect'
import {XY} from '../math/xy'

// A proxy with caching for keeping and manipulating multiple images relative an
// origin.
export class ImageGroup {
  private _target: Rect = {x: 0, y: 0, w: 0, h: 0}
  constructor(
    private readonly _atlas: Atlas.Definition,
    private readonly _images: readonly Image[]
  ) {
    this.invalidate()
  }
  images(): readonly Image[] {
    return this._images
  }
  moveTo(target: XY): void {
    if (XY.equal(this._target, target)) return
    this.moveBy(XY.sub(target, this._target))
  }
  moveBy(offset: XY): void {
    this._target = Rect.add(this._target, {...offset, w: 0, h: 0})
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
  private invalidate(): void {
    this._target = Image.target(this._atlas, this._images)
  }
}
