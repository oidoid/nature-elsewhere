import {GL, GLTexture, GLUniformLocation} from './gl'
import {Assets, TextureAssetID} from '../assets/asset-loader'
import {Sprite} from '../assets/sprites/sprite'
import {ShaderContext} from './glsl/shader-loader'
import {WH, XY} from '../types/geo'
import {VERTEX_ATTRS_STRIDE, VERTEX_ATTRS} from './vertex'

/** Creates, binds, and configures a texture. */
function createTexture(gl: GL): GLTexture | null {
  const texture = gl.createTexture()
  const target = gl.TEXTURE_2D
  gl.bindTexture(target, texture)
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  return texture
}

// yo these will int16s so expect _truncation_
// TypeScript gl. doesn't work but WebGLRenderingContext. does

export function init(gl: GL, ctx: ShaderContext, assets: Assets): void {
  const texture = createTexture(gl)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(ctx.location('uSampler'), 0)
  const atlas = assets[TextureAssetID.ATLAS]
  // or atlas.animations[sprite.texture.textureID].size
  gl.uniform2f(
    ctx.location('uAtlasSize'),
    atlas.naturalWidth,
    atlas.naturalHeight
  )

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  let offset = 0
  for (const {name, itemType, length} of VERTEX_ATTRS) {
    gl.vertexAttribPointer(
      ctx.location(name),
      length,
      itemType,
      false,
      VERTEX_ATTRS_STRIDE,
      offset
    )
    gl.enableVertexAttribArray(ctx.location(name))
    offset += length * Int16Array.BYTES_PER_ELEMENT
  }

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    assets[TextureAssetID.ATLAS]
  )
}

export function deinit(
  gl: GL,
  ctx: ShaderContext,
  texture: WebGLTexture | null,
  buffer: WebGLBuffer | null
): void {
  gl.deleteBuffer(buffer)
  for (const {name} of VERTEX_ATTRS)
    gl.disableVertexAttribArray(ctx.location(name))

  gl.deleteTexture(texture)
}

export function render(
  gl: GL,
  ctx: ShaderContext,
  sprites: Sprite[],
  verts: Int16Array,
  camera: XY,
  bounds: WH,
  minRenderHeight: number // hieght in peixels
): void {
  resize(gl, ctx.location('uViewport'), camera, bounds, minRenderHeight)

  const VERTS_PER_TRI = 3
  const TRIS_PER_RECT = 2
  const VERTS_PER_SPRITE = VERTS_PER_TRI * TRIS_PER_RECT
  gl.bufferData(gl.ARRAY_BUFFER, verts, WebGLRenderingContext.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLES, 0, VERTS_PER_SPRITE * sprites.length)
}

/**
 * Resizes the viewport and Canvas. Scaling is performed proportionally using
 * integer ratios to maintain pixel perfect accuracy which may yield a Canvas
 * slightly larger than window.
 */
function resize(
  gl: GL,
  viewportLocation: GLUniformLocation | null,
  camera: XY,
  bounds: WH,
  minRenderHeight: number
): void {
  // An integer multiple.
  const scale = Math.max(1, Math.floor(bounds.h / minRenderHeight))
  const renderWidth = Math.ceil(bounds.w / scale)
  const renderHeight = Math.ceil(bounds.h / scale)

  // Update the vertex shader's resolution and the viewport within the canvas to
  // use the complete canvas area. For this game, the resolution is so low that
  // the canvas's native dimensions within the window are like a postage stamp
  // on an envelope.
  gl.uniform4f(viewportLocation, camera.x, camera.y, renderWidth, renderHeight)

  // add cache layer for viewport and uniform4f
  if (gl.canvas.width === renderWidth && gl.canvas.height === renderHeight) {
    return
  }

  // Set the canvas' native dimensions.
  gl.canvas.width = renderWidth
  gl.canvas.height = renderHeight

  gl.viewport(0, 0, renderWidth, renderHeight)

  // Uniformly stretch the canvas to the window's bounds. Continuing the
  // metaphor of the previous comment, the stamp now covers the envelope. These
  // dimensions may slightly exceed the bounds to retain pixel perfect scaling.
  // Excess is cropped from the lower-right corner. The maximum excess is equal
  // to `scale` pixels in both axes.
  const scaledWidth = renderWidth * scale
  const scaledHeight = renderHeight * scale
  gl.canvas.style.width = `${scaledWidth}px`
  gl.canvas.style.height = `${scaledHeight}px`
}
