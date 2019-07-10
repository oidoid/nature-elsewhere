import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {Rect} from '../math/rect'
import {StoreBuffer} from './store-buffer'

export interface StoreUpdate {
  /** data.byteLength may exceed bytes to be rendered. length is the only
      accurate number of instances. */
  readonly data: DataView
  readonly length: number
}

export class Store {
  private readonly images: Image[] = []
  private _instances: DataView
  constructor(
    private readonly _shaderLayout: ShaderLayout,
    private readonly _atlas: Atlas.Definition
  ) {
    this._instances = StoreBuffer.make(0)
  }

  addImages(...images: readonly Image[]): void {
    images.forEach(image => this.addImage(image))
  }

  addImage(image: Image): void {
    const index = this.images.findIndex(val => image.layer() <= val.layer())
    this.images.splice(index === -1 ? this.images.length : index, 0, image)
  }

  update(
    atlas: Atlas.Definition,
    milliseconds: number,
    cam: Rect
  ): StoreUpdate {
    const minBytes = this.images.length * this._shaderLayout.perInstance.stride
    if (this._instances.byteLength < minBytes) {
      this._instances = StoreBuffer.make(
        StoreBuffer.size(this._shaderLayout, this.images.length * 2)
      )
    }

    let i = 0
    this.images.forEach(image => {
      image.update(atlas, milliseconds)
      if (Rect.intersects(image.target(this._atlas), cam)) {
        StoreBuffer.set(
          this._shaderLayout,
          this._atlas,
          this._instances,
          i,
          image
        )
        ++i
      }
    })
    return {data: this._instances, length: i}
  }
}
