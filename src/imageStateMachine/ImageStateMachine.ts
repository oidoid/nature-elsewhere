import {AtlasID} from '../atlas/AtlasID'
import {Image} from '../image/Image'
import {ImageRect} from './ImageRect'
import {Layer} from '../image/Layer'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../math/XY'

// origin in level XY
// would be nice to make all changes at once instead of walking th eimages multiple itmes.
export class ImageStateMachine<State extends string = string> {
  private _state: State
  private readonly _map: Readonly<Record<State, ImageRect>>

  constructor(props: ImageStateMachine.Props<State>) {
    this._state = props.state
    this._map = props.map
    ObjectUtil.assertKeyOf(this._map, this._state, 'ImageStateMachine')
  }

  get state(): State {
    return this._state
  }

  getStates(): State[] {
    return ObjectUtil.keys(this._map)
  }

  imageRect(): ImageRect {
    return this._map[this.state]
  }

  images(): readonly Image[] {
    return this.imageRect().images
  }

  setImageID(id?: AtlasID): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    for (const state in this._map) status |= this._map[state].setImageID(id)
    return status
  }

  setState(state: State): UpdateStatus {
    if (this.state === state) return UpdateStatus.UNCHANGED
    const {bounds, scale} = this.imageRect()
    this._state = state
    this.imageRect().moveTo(bounds.position)
    this.resetAnimation()
    this.scaleTo(scale)
    return UpdateStatus.UPDATED
  }

  replaceImages(state: State, ...images: readonly Image[]): UpdateStatus {
    this._map[state].replace(...images)
    return UpdateStatus.UPDATED
  }

  moveTo(to: XY): UpdateStatus {
    return this.imageRect().moveTo(to)
  }

  scaleTo(scale: XY): UpdateStatus {
    return this.imageRect().scaleTo(scale)
  }

  /** Raise or lower all images for all states. */
  elevate(offset: Layer): void {
    for (const state in this._map) this._map[state].elevate(offset)
  }

  /** Reset the animations of all images in the current state. */
  resetAnimation(): void {
    for (const image of this.images()) image.resetAnimation()
  }
}

export namespace ImageStateMachine {
  export interface Props<State extends string> {
    state: State
    map: Record<State, ImageRect>
  }
}
