import {Atlas} from '../atlas/atlas'
import {Image} from '../images/image'
import {Entity} from '../entities/entity'
import {InstanceBuffer} from './instance-buffer'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {ShaderLayout} from '../graphics/shaders/shader-layout'
import {Level} from '../levels/level'

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
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): Store {
    const camCopy = {...cam}
    const images = entities
      .filter(
        entity =>
          entity.updateType === 'ALWAYS' ||
          Rect.intersects(entity.states[entity.state], cam)
      )
      .map((entity, _, entities) =>
        Entity.update(
          entity,
          entities,
          level,
          atlas,
          camCopy,
          milliseconds,
          recorder
        )
      )
      .reduce((sum: Image[], val) => [...sum, ...val], [])
      .sort(Image.compare)

    const size = InstanceBuffer.size(layout, images.length)
    if (dat.byteLength < size) dat = InstanceBuffer.make(size * 2)
    images.forEach((img, i) => InstanceBuffer.set(layout, atlas, dat, i, img))
    ;(<any>cam).x = camCopy.x
    ;(<any>cam).y = camCopy.y
    return {layout, atlas, dat, len: images.length}
  }
}
