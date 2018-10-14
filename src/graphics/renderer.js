import * as shader from './shader.js'
import fragmentShaderSource from './fragmentShader.js'
import vertexShaderSource from './vertexShader.js'

/** @typedef {WebGL2RenderingContext} GL */
/** @typedef {WebGLProgram} GLProgram */
/** @typedef {WebGLShader} GLShader */
/** @typedef {WebGLUniformLocation | null} GLUniform */
/** @typedef {WebGLBuffer | null} GLBuffer */
/** @typedef {WEBGL_lose_context | null} GLLoseContext */

const GLX = /** @type {typeof WebGL2RenderingContext} */ (WebGL2RenderingContext)
const perVertexData = new Int16Array([1, 1, 0, 1, 1, 0, 0, 0])

/**
 * @arg {HTMLCanvasElement} canvas
 * @arg {HTMLImageElement} atlas
 * @return {Renderer}
 */
export function init(canvas, atlas) {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    antialias: false,
    failIfMajorPerformanceCaveat: true
  })
  if (!gl) throw new Error('WebGL 2 unsupported.')

  const program = gl.createProgram()
  if (program === null) throw new Error('Unable to create WebGL program.')
  const vertexShader = loadShader(gl, GLX.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = loadShader(
    gl,
    GLX.FRAGMENT_SHADER,
    fragmentShaderSource
  )
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  // Mark shaders for deletion when unused.
  gl.detachShader(program, fragmentShader)
  gl.detachShader(program, vertexShader)
  gl.deleteShader(fragmentShader)
  gl.deleteShader(vertexShader)

  const log = gl.getProgramInfoLog(program)
  if (log) console.error(log)

  // Allow translucent textures to be layered.
  gl.enable(gl.BLEND)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(GLX.SRC_ALPHA, GLX.ONE_MINUS_SRC_ALPHA)

  const projection = gl.getUniformLocation(program, 'projection')
  gl.uniform1i(gl.getUniformLocation(program, 'sampler'), 0)
  const atlasSize = gl.getUniformLocation(program, 'atlasSize')
  gl.uniform2i(atlasSize, atlas.naturalWidth, atlas.naturalHeight)

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
  const texture = gl.createTexture()
  gl.bindTexture(GLX.TEXTURE_2D, texture)
  gl.texParameteri(GLX.TEXTURE_2D, GLX.TEXTURE_MIN_FILTER, GLX.NEAREST)
  gl.texParameteri(GLX.TEXTURE_2D, GLX.TEXTURE_MAG_FILTER, GLX.NEAREST)
  gl.texImage2D(GLX.TEXTURE_2D, 0, GLX.RGBA, GLX.RGBA, GLX.UNSIGNED_BYTE, atlas)
  // Leave texture bound.

  const loseContext = gl.getExtension('WEBGL_lose_context')

  return new Renderer(gl, projection, perInstanceBuffer, loseContext)
}

export class Renderer {
  /**
   * @arg {GL} gl
   * @arg {GLUniform} projection
   * @arg {GLBuffer} perInstanceBuffer
   * @arg {GLLoseContext} loseContext
   */
  constructor(gl, projection, perInstanceBuffer, loseContext) {
    /** @type {GL} */ this._gl = gl
    /** @type {GLUniform} */ this._projection = projection
    /** @type {GLBuffer} */ this._perInstanceBuffer = perInstanceBuffer
    /** @type {GLLoseContext} */ this._loseContext = loseContext
  }

  /**
   * @arg {WH} canvas
   * @arg {number} scale
   * @arg {XY} position
   * @arg {Int16Array} perInstanceData
   * @arg {number} instances
   * @return {void}
   */
  render(canvas, scale, position, perInstanceData, instances) {
    this._resize(canvas, scale, position)

    bufferData(
      this._gl,
      this._perInstanceBuffer,
      perInstanceData,
      GLX.DYNAMIC_READ
    )
    const vertices = perVertexData.length / shader.layout.perVertex.length
    this._gl.drawArraysInstanced(GLX.TRIANGLE_STRIP, 0, vertices, instances)
  }

  /** @return {boolean} */
  isContextLost() {
    return this._gl.isContextLost()
  }

  /** @return {void} */
  debugLoseContext() {
    if (!this._loseContext) return
    this._loseContext.restoreContext()
  }

  /** @return {void} */
  debugRestoreContext() {
    if (!this._loseContext) return
    this._loseContext.restoreContext()
  }

  /**
   * @arg {WH} canvas The desired resolution of the canvas in CSS pixels.
   *                    E.g., {w: window.innerWidth, h: window.innerHeight}.
   * @arg {number} scale Positive integer zoom.
   * @arg {XY} focus The position to center on in physical pixels.
   * @return {void}
   */
  _resize(canvas, scale, focus) {
    this._gl.canvas.width = canvas.w
    this._gl.canvas.height = canvas.h

    // The camera position is a function of the position and the canvas'
    // dimensions.
    //
    // The pixel position is rendered by implicitly truncating the model
    // position. Similarly, it is necessary to truncate the model position prior
    // to camera input to avoid rounding errors that cause the camera to lose
    // synchronicity with the rendered position and create jitter when the
    // position updates.
    //
    // For example, the model position may be 0.1 and the camera at an offset
    // from the position of 100.9. The rendered position is thus truncated to 0.
    // Consider the possible camera positions:
    //
    //   Formula                   Result  Pixel position  Camera pixel  Distance  Notes
    //   0.1 + 100.9             =  101.0               0           101       101  No truncation.
    //   Math.trunc(0.1) + 100.9 =  100.9               0           100       100  Truncate before input.
    //   Math.trunc(0.1 + 100.9) =  101.0               0           101       101  Truncate after input.
    //
    // Now again when the model position has increased to 1.0 and the rendered
    // position is also 1, one pixel forward. The distance should be constant.
    //
    //   1.0 + 100.9             =  101.9               1           101       100  No truncation.
    //   Math.trunc(1.0) + 100.9 =  101.9               1           101       100  Truncate before input.
    //   Math.trunc(1.0 + 100.9) =  101.0               1           101       100  Truncate after input.
    //
    // As shown above, when truncation is not performed or it occurs afterwards
    // on the sum, rounding errors can cause the rendered distance between the
    // center of the camera and the position to vary under different inputs
    // instead of remaining at a constant offset.
    //
    // The canvas offsets should be truncated by the call the GL.uniform4i() but
    // these appear to use the ceiling instead so another distinct and
    // independent call to Math.trunc() is made.
    const cam = {
      // Center the camera on the x-position within the canvas bounds.
      x: Math.trunc(-focus.x) + Math.trunc(canvas.w / (scale * 2)),
      // Align the y-position with the bottom of the canvas.
      y: Math.trunc(focus.y),
      w: Math.ceil(canvas.w / scale),
      h: Math.ceil(canvas.h / scale)
    }

    // Convert the pixels to clipspace by taking them as a fraction of the cam
    // resolution, scaling to 0-2, flipping the y-coordinate so that positive y
    // is downward, and translating to -1 to 1 and again by the camera position.
    const ratio = {w: 2 / cam.w, h: 2 / cam.h}
    // prettier-ignore
    const projection = new Float32Array([
      ratio.w,        0, 0, -1 + cam.x * ratio.w,
            0, -ratio.h, 0, -1 + cam.y * ratio.h,
            0,        0, 1,                    0,
            0,        0, 0,                    1
    ])
    this._gl.uniformMatrix4fv(this._projection, false, projection)

    // The viewport is a rendered in physical pixels. It's intentional to use
    // the camera dimensions instead of canvas dimensions since the camera often
    // exceeds the canvas and the viewport's dimensions must be an integer
    // multiple of the camera.
    this._gl.viewport(0, 0, scale * cam.w, scale * cam.h)
  }
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
 * @arg {string} src
 * @return {GLShader}
 */
function loadShader(gl, type, src) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to create shader.')
  gl.shaderSource(shader, src.trim())
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
