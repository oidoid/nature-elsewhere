import {GL, GLTexture, check} from './gl'
import {Sprite} from '../assets/sprites/sprite'
import {ShaderProgram} from './shaders/shader-loader'
import {WH, XY} from '../types/geo'
import {VERT_ATTRS, VertAttr} from './vert'
import {resize} from './resizer'

export type Renderer = {
  readonly gl: GL
  readonly shader: ShaderProgram
  readonly vertArray: WebGLVertexArrayObject | null
  readonly buffer: {vert: WebGLBuffer | null; instance: WebGLBuffer | null}
}

export function getGL(canvas: HTMLCanvasElement): GL {
  return check(
    canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      antialias: false,
      failIfMajorPerformanceCaveat: true
    })
  )
}

export function init(
  gl: GL,
  shader: ShaderProgram,
  atlas: HTMLImageElement,
  verts: Int16Array
): Renderer {
  gl.uniform1i(shader.location('sampler'), 0)
  gl.uniform2i(
    shader.location('atlasSize'),
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
    initVertAttr(gl, shader, attr, vertBuffer)
  )
  bufferData(gl, vertBuffer, verts)

  const instanceBuffer = gl.createBuffer()
  VERT_ATTRS.instance.attrs.forEach(attr =>
    initVertAttr(gl, shader, attr, instanceBuffer)
  )

  gl.bindVertexArray(null)

  return {
    gl,
    shader,
    buffer: {vert: vertBuffer, instance: instanceBuffer},
    vertArray
  }
}

export function render(
  {gl, shader, ...renderer}: Renderer,
  sprites: Sprite[],
  verts: Int16Array,
  instances: Int16Array,
  canvas: WH,
  scale: number,
  position: XY
): void {
  resize(gl, shader.location('cam'), canvas, scale, position)

  gl.bindVertexArray(renderer.vertArray)

  bufferData(gl, renderer.buffer.instance, instances)
  gl.drawArraysInstanced(
    GL.TRIANGLE_STRIP,
    0,
    verts.length / VERT_ATTRS.vert.length,
    sprites.length
  )

  gl.bindVertexArray(null)
}

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

function initVertAttr(
  gl: GL,
  shader: ShaderProgram,
  attr: VertAttr,
  buffer: WebGLBuffer | null
) {
  const location = shader.location(attr.name)
  gl.enableVertexAttribArray(location)
  gl.bindBuffer(GL.ARRAY_BUFFER, buffer)
  gl.vertexAttribIPointer(
    location,
    attr.length,
    attr.type,
    attr.stride,
    attr.offset
  )
  gl.vertexAttribDivisor(location, attr.divisor)
  gl.bindBuffer(GL.ARRAY_BUFFER, null)
}

function bufferData(gl: GL, buffer: WebGLBuffer | null, data: Int16Array) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, GL.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

export function deinit(
  gl: GL,
  shader: ShaderProgram,
  texture: WebGLTexture | null,
  buffer: WebGLBuffer | null
): void {
  gl.deleteBuffer(buffer)
  for (const {name} of VERT_ATTRS.vert.attrs)
    gl.disableVertexAttribArray(shader.location(name))

  gl.deleteTexture(texture)
}
