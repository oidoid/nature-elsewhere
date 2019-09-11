import {Atlas} from '../atlas/atlas'
import {Image} from '../images/image'
import {InstanceBuffer} from './instance-buffer'
import {Level} from '../levels/level'
import {Recorder} from '../inputs/recorder'
import {Rect} from '../math/rect'
import {ShaderLayout} from '../graphics/shaders/shader-layout'
import {EntityRect} from '../entities/entity-rect'

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
    entities: EntityRect,
    level: Level,
    milliseconds: number,
    recorder: Recorder
  ): t => {
    const copy = {...cam}
    const images = EntityRect.update(
      entities,
      atlas,
      copy,
      level,
      milliseconds,
      recorder
    ).sort(Image.compare)
    ;(<any>cam).x = copy.x
    ;(<any>cam).y = copy.y
    ;(<any>cam).w = copy.w
    ;(<any>cam).h = copy.h

    const size = InstanceBuffer.size(layout, images.length)
    if (dat.byteLength < size) dat = InstanceBuffer.make(size * 2)
    images.forEach((img, i) => InstanceBuffer.set(layout, atlas, dat, i, img))
    return {layout, atlas, dat, len: images.length}
  }
}
