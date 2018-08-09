import {GL, GLTexture, GLUniformLocation} from './gl'
import {Assets, TextureAssetID} from '../assets/asset-loader'
import {Sprite} from '../assets/sprites/sprite'
import {ShaderContext} from './glsl/shader-loader'
import {WH, Rect} from '../types/geo'
import {VERT_ATTRS, VertAttr} from './vert'

/** Creates, binds, and configures a texture. */
function createTexture(gl: GL): GLTexture | null {
  const texture = gl.createTexture()
  const target = GL.TEXTURE_2D
  gl.bindTexture(target, texture)
  gl.texParameteri(target, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
  gl.texParameteri(target, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
  gl.bindTexture(target, null)
  return texture
}

// yo these will int16s so expect _truncation_
// TypeScript gl. doesn't work but WebGLRenderingContext. does

function initVertexAttrib(
  gl: GL,
  ctx: ShaderContext,
  attr: VertAttr,
  buffer: WebGLBuffer | null
) {
  const location = ctx.location(attr.name)
  gl.enableVertexAttribArray(location)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(
    location,
    attr.length,
    attr.type,
    false,
    attr.stride,
    attr.offset
  )
  gl.vertexAttribDivisor(location, attr.divisor)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

function bufferData(gl: GL, buffer: WebGLBuffer | null, data: Int16Array) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, GL.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

export type Gfx = {
  vertArray: WebGLVertexArrayObject | null
  buffer: {vert: WebGLBuffer | null; instance: WebGLBuffer | null}
}

export function init(gl: GL, ctx: ShaderContext, assets: Assets): Gfx {
  const atlas = assets[TextureAssetID.ATLAS]
  gl.uniform1i(ctx.location('sampler'), 0)
  gl.uniform2f(
    ctx.location('atlasSize'),
    atlas.naturalWidth,
    atlas.naturalHeight
  )

  gl.activeTexture(gl.TEXTURE0)
  const texture = createTexture(gl)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, atlas)
  // gl.bindTexture(gl.TEXTURE_2D, null)

  // or atlas.animations[sprite.texture.textureID].size

  const vertArray = gl.createVertexArray()
  gl.bindVertexArray(vertArray)

  const vertBuffer = gl.createBuffer()
  VERT_ATTRS.vert.attrs.forEach(attr =>
    initVertexAttrib(gl, ctx, attr, vertBuffer)
  )

  const instanceBuffer = gl.createBuffer()
  VERT_ATTRS.instance.attrs.forEach(attr =>
    initVertexAttrib(gl, ctx, attr, instanceBuffer)
  )

  gl.bindVertexArray(null)

  return {buffer: {vert: vertBuffer, instance: instanceBuffer}, vertArray}
}

export function deinit(
  gl: GL,
  ctx: ShaderContext,
  texture: WebGLTexture | null,
  buffer: WebGLBuffer | null
): void {
  gl.deleteBuffer(buffer)
  for (const {name} of VERT_ATTRS.vert.attrs)
    gl.disableVertexAttribArray(ctx.location(name))

  gl.deleteTexture(texture)
}

export function render(
  gl: GL,
  ctx: ShaderContext,
  sprites: Sprite[],
  verts: Int16Array,
  instances: Int16Array,
  canvas: WH,
  cam: Rect, // in pixels
  viewport: WH,
  gfx: Gfx
): void {
  resize(gl, ctx.location('cam'), canvas, cam, viewport)

  gl.bindVertexArray(gfx.vertArray)

  bufferData(gl, gfx.buffer.vert, verts)
  bufferData(gl, gfx.buffer.instance, instances)
  gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, verts.length / 2, sprites.length)

  gl.bindVertexArray(null)
}

function resize(
  gl: GL,
  camLocation: GLUniformLocation | null,
  canvas: WH,
  cam: Rect,
  viewport: WH
): void {
  gl.canvas.width = canvas.w
  gl.canvas.height = canvas.h

  gl.uniform4f(camLocation, cam.x, cam.y, cam.w, cam.h)

  gl.viewport(0, 0, viewport.w, viewport.h)
}
