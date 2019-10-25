import {EntityID} from '../entity/EntityID'
import {FloatXY} from '../math/FloatXY'
import {ReadonlyRect} from '../math/Rect'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export class Camera {
  readonly _bounds: {position: FloatXY; size: WH}
  /** EntityID.ANONYMOUS if not following. */
  followID: EntityID

  constructor(
    position: Readonly<XY> | Readonly<FloatXY> = {x: 0, y: 0},
    followID: EntityID = EntityID.ANONYMOUS
  ) {
    this._bounds = {
      position: {x: position.x, y: position.y},
      size: new WH(0, 0)
    }
    this.followID = followID
  }

  get bounds(): ReadonlyRect {
    return {
      position: XY.trunc(this._bounds.position.x, this._bounds.position.y),
      size: this._bounds.size
    }
  }

  get fposition(): Readonly<FloatXY> {
    return this._bounds.position
  }

  moveTo(to: FloatXY | XY): void {
    this._bounds.position.x = to.x
    this._bounds.position.y = to.y
  }

  sizeTo(to: WH): void {
    this._bounds.size.w = to.w
    this._bounds.size.h = to.h
  }
}
