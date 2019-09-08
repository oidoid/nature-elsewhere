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
type t = Store

export namespace Store {
  export const make = (layout: ShaderLayout, atlas: Atlas): t => ({
    atlas,
    layout,
    dat: InstanceBuffer.make(0),
    len: 0
  })

  export const update = (
    {layout, atlas, dat}: t,
    cam: Rect,
    entities: readonly Entity[],
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): t => {
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
