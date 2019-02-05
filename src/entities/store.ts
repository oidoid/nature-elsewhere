import * as rect from '../math/rect'
import * as shader from '../graphics/shader'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'

export interface StoreUpdate {
  /** instances.byteLength may exceed bytes to be rendered. length is the only
      accurate number of instances. */
  readonly instances: DataView
  readonly length: number
}

export class Store {
  private readonly images: Image[] = []
  private _instances: DataView = shader.newInstanceBuffer(1024)
  constructor(private readonly _atlas: AtlasDefinition) {}

  addImages(...images: Image[]): void {
    images.forEach(image => this.addImage(image))
  }

  addImage(image: Image): void {
    const index = this.images.findIndex(val => image.layer() <= val.layer())
    this.images.splice(index === -1 ? this.images.length : index, 0, image)
  }

  update(milliseconds: number, cam: Rect): StoreUpdate {
    const minBytes = this.images.length * shader.layout.perInstance.stride
    if (this._instances.byteLength < minBytes) {
      this._instances = shader.newInstanceBuffer(this.images.length * 2)
    }

    let length = 0
    this.images.forEach((image, i) => {
      image.update(milliseconds)
      if (rect.intersects(image.target(), cam)) {
        shader.packInstance(this._atlas, this._instances, i, image)
        ++length
      }
    })
    return {instances: this._instances, length}
  }
}
