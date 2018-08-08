import {GL} from './gl'
import {XY} from '../types/geo'

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
  vert: VertAttr[]
  instance: VertAttr[]
}>

function offset(attrs: {size: number; length: number}[]): number {
  return attrs.reduce((sum, {size, length}) => sum + size * length, 0)
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
function mixOffsets(
  attr: Omit<VertAttr, 'stride' | 'offset'>,
  index: number,
  attrs: {size: number; length: number}[]
) {
  return {...attr, offset: offset(attrs.slice(0, index)), stride: offset(attrs)}
}

const SHORT_SIZE = Int16Array.BYTES_PER_ELEMENT
// This layout is tightly coupled to the vertex shader and buffers.
export const VERT_ATTRS: VertAttrs = {
  vert: [
    {name: 'uv', type: GL.SHORT, size: SHORT_SIZE, length: 2, divisor: 0}
  ].map(mixOffsets),
  instance: [
    {name: 'coord', type: GL.SHORT, size: SHORT_SIZE, length: 4, divisor: 1},
    {name: 'scroll', type: GL.SHORT, size: SHORT_SIZE, length: 2, divisor: 1},
    {name: 'position', type: GL.SHORT, size: SHORT_SIZE, length: 3, divisor: 1},
    {name: 'scale', type: GL.SHORT, size: SHORT_SIZE, length: 2, divisor: 1}
  ].map(mixOffsets)
}

export function newVertex(uv: XY): number[] {
  return [uv.x, uv.y]
}
