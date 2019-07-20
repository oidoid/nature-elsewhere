import * as Atlas from '../atlas/atlas'
import * as Image from '../images/image'
import * as InstanceBuffer from './instance-buffer'
import * as Rect from '../math/rect'
import {ShaderLayout} from '../graphics/shaders/shader-layout'

export interface State {
  readonly shaderLayout: ShaderLayout
  readonly atlas: Atlas.State
  /** dat.byteLength may exceed bytes to be rendered. len is the only accurate
      number of instances. */
  readonly dat: DataView
  readonly len: number
}

export function make(shaderLayout: ShaderLayout, atlas: Atlas.State): State {
  return {atlas, shaderLayout, dat: InstanceBuffer.make(0), len: 0}
}

export function update(
  {shaderLayout, atlas, dat}: State,
  cam: Rect,
  entities: readonly Image.State[],
  milliseconds: number
): State {
  const images = entities
    .filter(entity => Rect.intersects(Image.target(atlas, entity), cam))
    .map(entity => Image.animate(entity, atlas, milliseconds))
    .sort((lhs, rhs) => Image.compare(atlas, lhs, rhs))

  const size = InstanceBuffer.size(shaderLayout, images.length)
  if (dat.byteLength < size) dat = InstanceBuffer.make(size * 2)
  images.forEach((img, i) =>
    InstanceBuffer.set(shaderLayout, atlas, dat, i, img)
  )

  return {shaderLayout, atlas, dat, len: images.length}
}
