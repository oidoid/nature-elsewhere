import * as Atlas from '../atlas/atlas'
import * as Image from '../images/image'
import * as Entity from '../entities/entity'
import * as InstanceBuffer from './instance-buffer'
import * as Rect from '../math/rect'
import {ShaderLayout} from '../graphics/shaders/shader-layout'

export interface State {
  readonly layout: ShaderLayout
  readonly atlas: Atlas.State
  /** dat.byteLength may exceed bytes to be rendered. len is the only accurate
      number of instances. */
  readonly dat: DataView
  readonly len: number
}

export function make(layout: ShaderLayout, atlas: Atlas.State): State {
  return {atlas, layout, dat: InstanceBuffer.make(0), len: 0}
}

export function update(
  {layout, atlas, dat}: State,
  cam: Rect,
  entities: readonly Entity.State[],
  milliseconds: number
): State {
  const images = entities
    .filter(entity => Rect.intersects(entity, cam))
    .map(entity => Entity.update(entity, atlas, milliseconds))
    .reduce((sum: Image.State[], val) => [...sum, ...val], [])
    .sort((lhs, rhs) => Image.compare(atlas, lhs, rhs))

  const size = InstanceBuffer.size(layout, images.length)
  if (dat.byteLength < size) dat = InstanceBuffer.make(size * 2)
  images.forEach((img, i) => InstanceBuffer.set(layout, atlas, dat, i, img))

  return {layout, atlas, dat, len: images.length}
}
