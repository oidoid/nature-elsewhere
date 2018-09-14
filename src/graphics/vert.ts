import {GL} from './gl'
import {XY, XYZ, Rect} from '../types/geo'

export type VertAttr = Readonly<{
  name: string
  type: number
  size: number
  length: number
  offset: number
  stride: number
  divisor: number
}>

export type VertAttrs = Readonly<{
  vert: Readonly<{attrs: VertAttr[]; length: number}>
  instance: Readonly<{attrs: VertAttr[]; length: number}>
}>

function offset(attrs: Omit<VertAttr, 'offset' | 'stride'>[]): number {
  return attrs.reduce((sum, {size, length}) => sum + size * length, 0)
}

function length(attrs: VertAttr[]): number {
  return attrs.reduce((sum, attr) => sum + attr.length, 0)
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
function mixOffsets(
  attr: Omit<VertAttr, 'offset' | 'stride'>,
  index: number,
  attrs: Omit<VertAttr, 'offset' | 'stride'>[]
): VertAttr {
  return {...attr, offset: offset(attrs.slice(0, index)), stride: offset(attrs)}
}

const SHORT_SIZE = Int16Array.BYTES_PER_ELEMENT
// This layout is tightly coupled to the vertex shader and buffers.
export const VERT_ATTRS: VertAttrs = (() => {
  const vertAttrs = [
    {name: 'uv', type: GL.SHORT, size: SHORT_SIZE, length: 2, divisor: 0}
  ].map(mixOffsets)
  const instanceAttrs = [
    {name: 'coord', type: GL.SHORT, size: SHORT_SIZE, length: 4, divisor: 1},
    {
      name: 'scrollPosition',
      type: GL.SHORT,
      size: SHORT_SIZE,
      length: 2,
      divisor: 1
    },
    {name: 'position', type: GL.SHORT, size: SHORT_SIZE, length: 3, divisor: 1},
    {name: 'scale', type: GL.SHORT, size: SHORT_SIZE, length: 2, divisor: 1}
  ].map(mixOffsets)
  return {
    vert: {
      attrs: vertAttrs,
      length: length(vertAttrs)
    },
    instance: {
      attrs: instanceAttrs,
      length: length(instanceAttrs)
    }
  }
})()

// todo: uniforms.
// export const uniforms = {
//   cam: {},
//   atlasSize: {},
//   sampler: {}
// }

export function newVert(uv: XY): number[] {
  return [uv.x, uv.y]
}

export function updateInstance(
  instances: Int16Array,
  i: number,
  coord: Rect,
  scrollPosition: XY,
  position: XYZ,
  scale: XY
): void {
  i *= VERT_ATTRS.instance.length
  instances[i + 0] = coord.x
  instances[i + 1] = coord.y
  instances[i + 2] = coord.w
  instances[i + 3] = coord.h
  instances[i + 4] = scrollPosition.x
  instances[i + 5] = scrollPosition.y
  instances[i + 6] = position.x
  instances[i + 7] = position.y
  instances[i + 8] = position.z
  instances[i + 9] = scale.x
  instances[i + 10] = scale.y
}
