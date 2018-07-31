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
  {name: 'aSubTexCoord', itemType: SHORT, itemSize: SHORT_SIZE, length: 4},
  {name: 'aTexScroll', itemType: SHORT, itemSize: SHORT_SIZE, length: 2},
  {name: 'aSubTexScale', itemType: SHORT, itemSize: SHORT_SIZE, length: 2},
  {name: 'aTextureUV', itemType: SHORT, itemSize: SHORT_SIZE, length: 2},
  {name: 'aPosition', itemType: SHORT, itemSize: SHORT_SIZE, length: 3}
]

export const VERTEX_ATTRS_STRIDE = VERTEX_ATTRS.reduce(
  (sum, {itemSize, length}) => sum + itemSize * length,
  0
)

export function newVertex(
  textureUV: XY,
  x: number,
  y: number,
  z: number,
  textureRect: Rect,
  textureScroll: XY,
  textureScale: XY
): number[] {
  return [
    textureRect.x,
    textureRect.y,
    textureRect.w,
    textureRect.h,
    textureScroll.x,
    textureScroll.y,
    textureScale.x,
    textureScale.y,
    textureUV.x,
    textureUV.y,
    x,
    y,
    z
  ]
}
