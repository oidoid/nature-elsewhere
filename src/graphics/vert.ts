import {Rect, XY} from '../types/geo'
import {GL} from './gl'

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
  verts: VertAttr[]
  instances: VertAttr[]
}>

function offset(attrs: {size: number; length: number}[]): number {
  return attrs.reduce((sum, {size, length}) => sum + size * length, 0)
}

const SHORT_SIZE = Int16Array.BYTES_PER_ELEMENT
// This layout is tightly coupled to the vertex shader and buffers.
export const VERT_ATTRS: VertAttrs = {
  verts: [
    {name: 'uv', type: GL.SHORT, size: SHORT_SIZE, length: 2, divisor: 0},
    {name: 'texCoord', type: GL.SHORT, size: SHORT_SIZE, length: 4, divisor: 0},
    {
      name: 'texScroll',
      type: GL.SHORT,
      size: SHORT_SIZE,
      length: 2,
      divisor: 0
    },
    {name: 'texScale', type: GL.SHORT, size: SHORT_SIZE, length: 2, divisor: 0},
    {name: 'position', type: GL.SHORT, size: SHORT_SIZE, length: 3, divisor: 0}
  ].map((attr, i, attrs) => ({
    ...attr,
    offset: offset(attrs.slice(0, i)),
    stride: offset(attrs)
  })),
  instances: []
}

export function newVertex(
  uv: XY,
  x: number,
  y: number,
  z: number,
  texRect: Rect,
  texScroll: XY,
  texScale: XY
): number[] {
  return [
    uv.x,
    uv.y,
    texRect.x,
    texRect.y,
    texRect.w,
    texRect.h,
    texScroll.x,
    texScroll.y,
    texScale.x,
    texScale.y,
    x,
    y,
    z
  ]
}
