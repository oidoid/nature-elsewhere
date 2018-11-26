import * as shader from './shader.js'
import fragmentShaderSource from './fragment-shader.js'
import vertexShaderSource from './vertex-shader.js'

/** @typedef {WebGL2RenderingContext} GL */
/** @typedef {WebGLProgram} GLProgram */
/** @typedef {WebGLShader} GLShader */
/** @typedef {WebGLUniformLocation | null} GLUniform */
/** @typedef {WebGLBuffer | null} GLBuffer */
/** @typedef {WEBGL_lose_context | null} GLLoseContext */

/**
 * @typedef {Object} State
 * @prop {GL} gl
 * @prop {GLUniform} projectionLocation
 * @prop {GLBuffer} perInstanceBuffer
 * @prop {GLLoseContext} loseContext
 */

const GLX = /** @type {typeof WebGL2RenderingContext} */ (WebGL2RenderingContext)
const perVertexData = new Int16Array([1, 1, 0, 1, 1, 0, 0, 0])

/**
 * @arg {HTMLCanvasElement} canvas
 * @arg {HTMLImageElement} atlas
 * @arg {HTMLImageElement} palettes
 * @return {State}
 */
export function newState(canvas, atlas, palettes) {
  const gl = /** @type {GL|null} */ (canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    antialias: false,
    failIfMajorPerformanceCaveat: true,
    lowLatency: true // https://www.chromestatus.com/feature/6360971442388992
  }))
  if (!gl) throw new Error('WebGL 2 unsupported.')

  const program = gl.createProgram()
  if (program === null) throw new Error('WebGL program creation failed.')
  const vertexShader = compileShader(gl, GLX.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = compileShader(
    gl,
    GLX.FRAGMENT_SHADER,
    fragmentShaderSource
  )
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  const log = gl.getProgramInfoLog(program)
  if (log) console.error(log)

  // Mark shaders for deletion when unused.
  gl.detachShader(program, fragmentShader)
  gl.detachShader(program, vertexShader)
  gl.deleteShader(fragmentShader)
  gl.deleteShader(vertexShader)

  // Allow translucent textures to be layered.
  gl.enable(gl.BLEND)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(GLX.SRC_ALPHA, GLX.ONE_MINUS_SRC_ALPHA)

  const projectionLocation = gl.getUniformLocation(program, 'projection')
  gl.uniform1i(gl.getUniformLocation(program, 'atlas'), 0)
  const atlasSize = gl.getUniformLocation(program, 'atlasSize')
  gl.uniform2i(atlasSize, atlas.naturalWidth, atlas.naturalHeight)
  gl.uniform1i(gl.getUniformLocation(program, 'palettes'), 1)
  const palettesSize = gl.getUniformLocation(program, 'palettesSize')
  gl.uniform2i(palettesSize, palettes.naturalWidth, palettes.naturalHeight)

  const vertexArray = gl.createVertexArray()
  gl.bindVertexArray(vertexArray)

  const perVertexBuffer = gl.createBuffer()
  shader.layout.perVertex.attributes.forEach(attr =>
    initAttribute(
      gl,
      program,
      attr,
      shader.layout.perVertex.type,
      shader.layout.perVertex.stride,
      shader.layout.perVertex.divisor,
      perVertexBuffer
    )
  )
  bufferData(gl, perVertexBuffer, perVertexData, GLX.STATIC_READ)

  const perInstanceBuffer = gl.createBuffer()
  shader.layout.perInstance.attributes.forEach(attr =>
    initAttribute(
      gl,
      program,
      attr,
      shader.layout.perInstance.type,
      shader.layout.perInstance.stride,
      shader.layout.perInstance.divisor,
      perInstanceBuffer
    )
  )

  // Leave vertexArray bound.

  gl.activeTexture(GLX.TEXTURE0)
  const atlasTexture = gl.createTexture()
  gl.bindTexture(GLX.TEXTURE_2D, atlasTexture)
  gl.texParameteri(GLX.TEXTURE_2D, GLX.TEXTURE_MIN_FILTER, GLX.NEAREST)
  gl.texParameteri(GLX.TEXTURE_2D, GLX.TEXTURE_MAG_FILTER, GLX.NEAREST)
  gl.texImage2D(GLX.TEXTURE_2D, 0, GLX.RGBA, GLX.RGBA, GLX.UNSIGNED_BYTE, atlas)
  // Leave texture bound.

  gl.activeTexture(GLX.TEXTURE1)
  const palettesTexture = gl.createTexture()
  gl.bindTexture(GLX.TEXTURE_2D, palettesTexture)
  gl.texParameteri(GLX.TEXTURE_2D, GLX.TEXTURE_MIN_FILTER, GLX.NEAREST)
  gl.texParameteri(GLX.TEXTURE_2D, GLX.TEXTURE_MAG_FILTER, GLX.NEAREST)
  gl.texImage2D(
    GLX.TEXTURE_2D,
    0,
    GLX.RGBA,
    GLX.RGBA,
    GLX.UNSIGNED_BYTE,
    palettes
  )
  // Leave texture bound.

  const loseContext = gl.getExtension('WEBGL_lose_context')

  return {gl, projectionLocation, perInstanceBuffer, loseContext}
}

/**
 * @arg {State} state
 * @arg {WH} canvas The desired resolution of the canvas in CSS pixels. E.g.,
 *                  {w: window.innerWidth, h: window.innerHeight}.
 * @arg {number} scale Positive integer zoom.
 * @arg {Rect} cam
 * @arg {Int16Array} perInstanceData
 * @arg {number} instances
 * @return {void}
 */
export function render(state, canvas, scale, cam, perInstanceData, instances) {
  resize(state, canvas, scale, cam)

  bufferData(
    state.gl,
    state.perInstanceBuffer,
    perInstanceData,
    GLX.DYNAMIC_READ
  )
  const vertices = perVertexData.length / shader.layout.perVertex.length
  state.gl.drawArraysInstanced(GLX.TRIANGLE_STRIP, 0, vertices, instances)
}

/**
 * @arg {{gl: GL}} state
 * @return {boolean}
 */
export function isContextLost({gl}) {
  return gl.isContextLost()
}

/**
 * @arg {{loseContext: GLLoseContext}} state
 * @return {void}
 */
export function debugLoseContext({loseContext}) {
  if (!loseContext) return
  loseContext.loseContext()
}

/**
 * @arg {{loseContext: GLLoseContext}} state
 * @return {void}
 */
export function debugRestoreContext({loseContext}) {
  if (!loseContext) return
  loseContext.restoreContext()
}

/**
 * @arg {{gl: GL, projectionLocation: GLUniform}} state
 * @arg {WH} canvas The desired resolution of the canvas in CSS pixels. E.g.,
 *                  {w: window.innerWidth, h: window.innerHeight}.
 * @arg {number} scale Positive integer zoom.
 * @arg {Rect} cam
 * @return {void}
 */
function resize({gl, projectionLocation}, canvas, scale, cam) {
  gl.canvas.width = canvas.w
  gl.canvas.height = canvas.h

  // Convert the pixels to clipspace by taking them as a fraction of the cam
  // resolution, scaling to 0-2, flipping the y-coordinate so that positive y is
  // downward, and translating to -1 to 1 and again by the camera position.
  const ratio = {w: 2 / cam.w, h: 2 / cam.h}
  // prettier-ignore
  const projection = new Float32Array([
    ratio.w,        0, 0, -1 - cam.x * ratio.w,
          0, -ratio.h, 0,  1 + cam.y * ratio.h,
          0,        0, 1,                    0,
          0,        0, 0,                    1
  ])
  gl.uniformMatrix4fv(projectionLocation, false, projection)

  // The viewport is a rendered in physical pixels. It's intentional to use the
  // camera dimensions instead of canvas dimensions since the camera often
  // exceeds the canvas and the viewport's dimensions must be an integer
  // multiple of the camera.
  gl.viewport(0, 0, scale * cam.w, scale * cam.h)
}

/**
 * @arg {GL} gl
 * @arg {GLProgram} program
 * @arg {typeof shader.layout.perInstance.attributes[number]} attribute
 * @arg {string} type
 * @arg {number} stride
 * @arg {number} divisor
 * @arg {GLBuffer} buffer
 * @return {void}
 */
function initAttribute(gl, program, attribute, type, stride, divisor, buffer) {
  const location = gl.getAttribLocation(program, attribute.name)
  gl.enableVertexAttribArray(location)
  gl.bindBuffer(GLX.ARRAY_BUFFER, buffer)
  gl.vertexAttribIPointer(
    location,
    attribute.length,
    /** @type {any} */ (GLX)[type],
    stride,
    attribute.offset
  )
  gl.vertexAttribDivisor(location, divisor)
  gl.bindBuffer(GLX.ARRAY_BUFFER, null)
}

/**
 * @arg {GL} gl
 * @arg {number} type
 * @arg {string} source
 * @return {GLShader}
 */
function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Shader creation failed.')
  gl.shaderSource(shader, source.trim())
  gl.compileShader(shader)
  const log = gl.getShaderInfoLog(shader)
  if (log) console.error(log)
  return shader
}

/**
 * @arg {GL} gl
 * @arg {GLBuffer} buffer
 * @arg {Int16Array} data
 * @arg {number} usage
 * @return {void}
 */
function bufferData(gl, buffer, data, usage) {
  gl.bindBuffer(GLX.ARRAY_BUFFER, buffer)
  gl.bufferData(GLX.ARRAY_BUFFER, data, usage)
  gl.bindBuffer(GLX.ARRAY_BUFFER, null)
}
