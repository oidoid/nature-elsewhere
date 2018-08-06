import {GL, GLTexture, GLUniformLocation} from './gl'
import {Assets, TextureAssetID} from '../assets/asset-loader'
import {Sprite} from '../assets/sprites/sprite'
import {ShaderContext} from './glsl/shader-loader'
import {WH, Rect} from '../types/geo'
import {VERT_ATTRS, VertAttr} from './vert'

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

function glBuffer(gl: GL, buffer: WebGLBuffer | null, data: Int16Array) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, GL.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

export function init(gl: GL, ctx: ShaderContext, assets: Assets) {
  const texture = createTexture(gl)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(ctx.location('sampler'), 0)
  const atlas = assets[TextureAssetID.ATLAS]
  // or atlas.animations[sprite.texture.textureID].size
  gl.uniform2f(
    ctx.location('atlasSize'),
    atlas.naturalWidth,
    atlas.naturalHeight
  )

  const vertexArray = gl.createVertexArray()
  gl.bindVertexArray(vertexArray)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  VERT_ATTRS.vert.forEach(attr => initVertexAttrib(gl, ctx, attr, buffer))

  const instanceBuffer = gl.createBuffer()
  VERT_ATTRS.instance.forEach(attr =>
    initVertexAttrib(gl, ctx, attr, instanceBuffer)
  )
  gl.bindVertexArray(null)

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    assets[TextureAssetID.ATLAS]
  )

  return {buffer, vertexArray, instanceBuffer}
}

export function deinit(
  gl: GL,
  ctx: ShaderContext,
  texture: WebGLTexture | null,
  buffer: WebGLBuffer | null
): void {
  gl.deleteBuffer(buffer)
  for (const {name} of VERT_ATTRS.vert)
    gl.disableVertexAttribArray(ctx.location(name))

  gl.deleteTexture(texture)
}

export function render(
  gl: GL,
  ctx: ShaderContext,
  sprites: Sprite[],
  verts: Int16Array,
  canvas: WH,
  cam: Rect, // in pixels
  viewport: WH,
  {
    buffer,
    vertexArray
  }: {buffer: WebGLBuffer | null; vertexArray: WebGLVertexArrayObject | null}
): void {
  resize(gl, ctx.location('cam'), canvas, cam, viewport)

  const VERTS_PER_TRI = 3
  const TRIS_PER_RECT = 2
  const VERTS_PER_SPRITE = VERTS_PER_TRI * TRIS_PER_RECT

  gl.bindVertexArray(vertexArray)

  glBuffer(gl, buffer, verts)
  gl.drawArraysInstanced(gl.TRIANGLES, 0, VERTS_PER_SPRITE * sprites.length, 1)

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
