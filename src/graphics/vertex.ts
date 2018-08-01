import {Rect, XY} from '../types/geo'

export type VertexAttr = Readonly<{
  name: string
  itemType: number
  itemSize: number
  length: number
}>

const SHORT = WebGLRenderingContext.SHORT
const SHORT_SIZE = Int16Array.BYTES_PER_ELEMENT
// This layout is tightly coupled to the vertex shader.
export const VERTEX_ATTRS: VertexAttr[] = [
  {name: 'uv', itemType: SHORT, itemSize: SHORT_SIZE, length: 2},
  {name: 'texCoord', itemType: SHORT, itemSize: SHORT_SIZE, length: 4},
  {name: 'texScroll', itemType: SHORT, itemSize: SHORT_SIZE, length: 2},
  {name: 'texScale', itemType: SHORT, itemSize: SHORT_SIZE, length: 2},
  {name: 'position', itemType: SHORT, itemSize: SHORT_SIZE, length: 3}
]

export const VERTEX_ATTRS_STRIDE = VERTEX_ATTRS.reduce(
  (sum, {itemSize, length}) => sum + itemSize * length,
  0
)

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
