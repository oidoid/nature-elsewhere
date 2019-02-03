import * as shader from './graphics/shader'
import {AtlasDefinition} from './images/atlas-definition'
import {Image} from './images/image'

const maxLen: number = 1000
const data: DataView = new DataView(shader.newInstanceBuffer(maxLen))

export interface StoreUpdate {
  readonly data: DataView
  readonly length: number
}

export class Store {
  private readonly images: Image[] = []
  constructor(private readonly _atlas: AtlasDefinition) {}

  addImages(...images: Image[]): void {
    images.forEach(image => this.addImage(image))
  }

  addImage(image: Image): void {
    const index = this.images.findIndex(val => image.layer() <= val.layer())
    this.images.splice(index === -1 ? this.images.length : index, 0, image)
  }

  update(milliseconds: number): StoreUpdate {
    this.images.forEach((image, i) => {
      image.update(milliseconds)
      shader.packInstance(this._atlas, data, i, image)
    })
    return {data, length: this.images.length}
  }
}
