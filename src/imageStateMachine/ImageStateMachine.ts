import {AtlasID} from '../atlas/AtlasID'
import {Image} from '../image/Image'
import {ImageRect} from './ImageRect'
import {Layer} from '../image/Layer'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {XY} from '../math/XY'
import {ReadonlyRect} from '../math/Rect'

export type ImageStateMap<State extends string = string> = Readonly<
  Record<State, ImageRect>
>

export class ImageStateMachine<State extends string = string> {
  private _state: State
  private readonly _map: ImageStateMap<State>

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

  images(): readonly Readonly<Image>[] {
    return this._imageRect().images
  }

  bounds(): ReadonlyRect {
    return this._imageRect().bounds
  }

  origin(): Readonly<XY> {
    return this._imageRect().origin
  }

  moveBy(by: Readonly<XY>): UpdateStatus {
    return this._imageRect().moveBy(by)
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this._imageRect().moveTo(to)
  }

  addImages(...images: readonly Image[]): void {
    this._imageRect().add(...images)
  }

  setImageID(id?: AtlasID): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    for (const state in this._map) status |= this._map[state].setImageID(id)
    return status
  }

  setState(state: State): UpdateStatus {
    if (this.state === state) return UpdateStatus.UNCHANGED
    const {bounds, scale} = this._imageRect()
    this._state = state
    this._imageRect().moveTo(bounds.position)
    this.resetAnimation()
    this.scaleTo(scale)
    return UpdateStatus.UPDATED
  }

  replaceImages(state: State, ...images: readonly Image[]): UpdateStatus {
    this._map[state].replace(...images)
    return UpdateStatus.UPDATED
  }

  getScale(): Readonly<XY> {
    return this._imageRect().scale
  }

  getImageID(): Maybe<AtlasID> {
    return this._imageRect().imageID
  }

  intersects(bounds: ReadonlyRect): Readonly<Image>[] {
    return this._imageRect().intersects(bounds)
  }

  scaleTo(scale: Readonly<XY>): UpdateStatus {
    return this._imageRect().scaleTo(scale)
  }

  /** Raise or lower all images for all states. */
  elevate(offset: Layer): void {
    for (const state in this._map) this._map[state].elevate(offset)
  }

  /** Reset the animations of all images in the current state. */
  resetAnimation(): void {
    for (const image of this.images()) image.resetAnimation()
  }

  private _imageRect(): ImageRect {
    return this._map[this.state]
  }
}

export namespace ImageStateMachine {
  export interface Props<State extends string> {
    state: State
    map: Record<State, ImageRect>
  }
}
