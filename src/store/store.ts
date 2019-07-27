import {Atlas} from '../atlas/atlas'
import {Image} from '../images/image'
import {Entity} from '../entities/entity'
import {InstanceBuffer} from './instance-buffer'
import {Rect} from '../math/rect'
import {ShaderLayout} from '../graphics/shaders/shader-layout'

export interface Store {
  readonly layout: ShaderLayout
  readonly atlas: Atlas
  /** dat.byteLength may exceed bytes to be rendered. len is the only accurate
      number of instances. */
  readonly dat: DataView
  readonly len: number
}

export namespace Store {
  export function make(layout: ShaderLayout, atlas: Atlas): Store {
    return {atlas, layout, dat: InstanceBuffer.make(0), len: 0}
  }

  export function update(
    {layout, atlas, dat}: Store,
    cam: Rect,
    entities: readonly Entity[],
    milliseconds: number
  ): Store {
    const images = entities
      .filter(entity => Rect.intersects(entity, cam))
      .map(entity => Entity.update(entity, atlas, milliseconds))
      .reduce((sum: Image[], val) => [...sum, ...val], [])
      .sort((lhs, rhs) => Image.compare(atlas, lhs, rhs))

    const size = InstanceBuffer.size(layout, images.length)
    if (dat.byteLength < size) dat = InstanceBuffer.make(size * 2)
    images.forEach((img, i) => InstanceBuffer.set(layout, atlas, dat, i, img))

    return {layout, atlas, dat, len: images.length}
  }
}
