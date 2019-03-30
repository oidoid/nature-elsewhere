import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {Rect} from '../math/rect'
import {Shader} from '../graphics/shader'

export interface StoreUpdate {
  /** instances.byteLength may exceed bytes to be rendered. length is the only
      accurate number of instances. */
  readonly instances: DataView
  readonly length: number
}

export class Store {
  private readonly images: Image[] = []
  private _instances: DataView = Shader.newInstanceBuffer(1024)
  constructor(private readonly _atlas: Atlas.Definition) {}

  addImages(...images: readonly Image[]): void {
    images.forEach(image => this.addImage(image))
  }

  addImage(image: Image): void {
    const index = this.images.findIndex(val => image.layer() <= val.layer())
    this.images.splice(index === -1 ? this.images.length : index, 0, image)
  }

  update(milliseconds: number, cam: Rect): StoreUpdate {
    const minBytes = this.images.length * Shader.layout.perInstance.stride
    if (this._instances.byteLength < minBytes) {
      this._instances = Shader.newInstanceBuffer(this.images.length * 2)
    }

    let i = 0
    this.images.forEach(image => {
      image.update(milliseconds)
      if (Rect.intersects(image.target(), cam)) {
        Shader.packInstance(this._atlas, this._instances, i, image)
        ++i
      }
    })
    return {instances: this._instances, length: i}
  }
}
