import {ImageRect} from './ImageRect'
import {UpdateStatus} from '../entities/updaters/updateStatus/UpdateStatus'
import {Layer} from '../image/Layer'
import {XY} from '../math/XY'
import {AtlasID} from '../atlas/AtlasID'
import {Entity} from '../entity/Entity'
import {Image} from '../image/Image'

// origin in level XY
// would be nice to make all changes at once instead of walking th eimages multiple itmes.
export class ImageStateMachine {
  private _state: Entity.State | string
  private readonly _map: Readonly<Record<Entity.State | string, ImageRect>>

  constructor({
    state = Entity.State.HIDDEN,
    map = {[Entity.State.HIDDEN]: new ImageRect()}
  }: ImageStateMachine.Props = {}) {
    this._state = state
    this._map = map
  }

  get state(): Entity.State | string {
    return this._state
  }

  getStates(): (Entity.State | string)[] {
    return Object.keys(this._map)
  }

  imageRect(): ImageRect {
    return this._map[this.state]
  }

  images(): readonly Image[] {
    return this.imageRect().images
  }

  setImageID(id: AtlasID): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    for (const state in this._map) status |= this._map[state].setImageID(id)
    return status
  }

  setState(state: Entity.State | string): UpdateStatus {
    if (this.state === state) return UpdateStatus.UNCHANGED
    const {bounds, scale} = this.imageRect()
    this._state = state
    this.imageRect().moveTo(bounds.position)
    this.resetAnimation()
    this.scaleTo(scale)
    return UpdateStatus.UPDATED
  }

  replaceImages(
    state: Entity.State | string,
    ...images: readonly Image[]
  ): UpdateStatus {
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
  export interface Props {
    state?: Entity.State | string
    map?: Record<Entity.State | string, ImageRect>
  }
}
