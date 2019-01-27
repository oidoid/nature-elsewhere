import * as shader from './graphics/shader'
import {AtlasDefinition} from './images/atlas-definition'
import {Image} from './images/image'

const maxLen = 1000
const dataView = new DataView(shader.newInstanceBuffer(maxLen))

export class Store {
  private images: Image[] = []
  constructor(private _atlas: AtlasDefinition) {}

  addImages(...images: Image[]): void {
    images.forEach(image => this.addImage(image))
  }

  addImage(image: Image): void {
    const index = this.images.findIndex(val => image.layer() <= val.layer())
    this.images.splice(index === -1 ? this.images.length : index, 0, image)
  }

  update(_milliseconds: number) {
    // const step = milliseconds / 1000
    this.images.forEach((image, i) =>
      shader.packInstance(this._atlas, dataView, i, image)
    )
    return {dataView, length: this.images.length}
  }
}
