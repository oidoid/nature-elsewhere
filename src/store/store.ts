import * as Atlas from '../images/atlas'
import * as Image from '../images/image'
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
  private instances: DataView
  constructor(
    private readonly shaderLayout: ShaderLayout,
    private readonly atlas: Atlas.State
  ) {
    this.instances = StoreBuffer.make(0)
  }

  addImages(atlas: Atlas.State, ...images: readonly Image[]): void {
    images.forEach(image => this.addImage(atlas, image))
  }

  addImage(atlas: Atlas.State, image: Image): void {
    const index = this.images.findIndex(
      val => Image.compare(atlas, image, val) < 0
    )
    this.images.splice(index === -1 ? this.images.length : index, 0, image)
  }

  update(atlas: Atlas.State, milliseconds: number, cam: Rect): StoreUpdate {
    const minBytes = this.images.length * this.shaderLayout.perInstance.stride
    if (this.instances.byteLength < minBytes) {
      this.instances = StoreBuffer.make(
        StoreBuffer.size(this.shaderLayout, this.images.length * 2)
      )
    }

    let i = 0
    this.images.forEach(image => {
      if (Rect.intersects(Image.target(this.atlas, image), cam)) {
        Image.animate(image, atlas, milliseconds)
        StoreBuffer.set(this.shaderLayout, this.atlas, this.instances, i, image)
        ++i
      }
    })
    return {data: this.instances, length: i}
  }
}
