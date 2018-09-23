import * as vertexShaderSource from './shader.vert'
import * as fragmentShaderSource from './shader.frag'
import * as shaderLayout from './shader.json'

type GL = WebGL2RenderingContext
type GLProgram = WebGLProgram | null
type GLShader = WebGLShader | null
type GLUniform = WebGLUniformLocation | null
type GLBuffer = WebGLBuffer | null
type GLLoseContext = WEBGL_lose_context | null

export type State = Readonly<{
  gl: GL
  program: GLProgram
  projection: GLUniform
  perInstanceBuffer: GLBuffer
  loseContext: GLLoseContext
}>

const GL = WebGL2RenderingContext
const perVertexData = new Int16Array([1, 1, 0, 1, 1, 0, 0, 0])

export function newState(
  canvas: HTMLCanvasElement,
  atlas: HTMLImageElement
): State {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    depth: false,
    antialias: false,
    failIfMajorPerformanceCaveat: true
  })
  if (!gl) throw new Error('WebGL 2 unsupported.')

  const program = gl.createProgram()
  const vertexShader = loadShader(gl, GL.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = loadShader(
    gl,
    GL.FRAGMENT_SHADER,
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
  gl.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

  const projection = gl.getUniformLocation(program, 'projection')
  gl.uniform1i(gl.getUniformLocation(program, 'sampler'), 0)
  const atlasSize = gl.getUniformLocation(program, 'atlasSize')
  gl.uniform2i(atlasSize, atlas.naturalWidth, atlas.naturalHeight)

  const vertexArray = gl.createVertexArray()
  gl.bindVertexArray(vertexArray)

  const perVertexBuffer = gl.createBuffer()
  shaderLayout.perVertex.attributes.forEach(attr =>
    initAttribute(
      gl,
      program,
      attr,
      shaderLayout.perVertex.type,
      shaderLayout.perVertex.stride,
      shaderLayout.perVertex.divisor,
      perVertexBuffer
    )
  )
  bufferData(gl, perVertexBuffer, perVertexData, GL.STATIC_READ)

  const perInstanceBuffer = gl.createBuffer()
  shaderLayout.perInstance.attributes.forEach(attr =>
    initAttribute(
      gl,
      program,
      attr,
      shaderLayout.perInstance.type,
      shaderLayout.perInstance.stride,
      shaderLayout.perInstance.divisor,
      perInstanceBuffer
    )
  )

  // Leave vertexArray bound.

  gl.activeTexture(GL.TEXTURE0)
  const texture = gl.createTexture()
  gl.bindTexture(GL.TEXTURE_2D, texture)
  gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
  gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
  gl.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, atlas)
  // Leave texture bound.

  const loseContext = gl.getExtension('WEBGL_lose_context')

  return {gl, program, projection, perInstanceBuffer, loseContext}
}

export function render(
  state: State,
  canvas: WH,
  scale: number,
  position: XY,
  perInstanceData: Int16Array,
  instances: number
): void {
  resize(state, canvas, scale, position)

  bufferData(
    state.gl,
    state.perInstanceBuffer,
    perInstanceData,
    GL.DYNAMIC_READ
  )
  const vertices = perVertexData.length / shaderLayout.perVertex.length
  state.gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, vertices, instances)
}

function loadShader(gl: GL, type: number, src: string): GLShader {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  const log = gl.getShaderInfoLog(shader)
  if (log) console.error(log)
  return shader
}

function initAttribute(
  gl: GL,
  program: GLProgram,
  attribute: typeof shaderLayout.perInstance.attributes[number],
  type: string,
  stride: number,
  divisor: number,
  buffer: GLBuffer
): void {
  const location = gl.getAttribLocation(program, attribute.name)
  gl.enableVertexAttribArray(location)
  gl.bindBuffer(GL.ARRAY_BUFFER, buffer)
  gl.vertexAttribIPointer(
    location,
    attribute.length,
    (<any>GL)[type],
    stride,
    attribute.offset
  )
  gl.vertexAttribDivisor(location, divisor)
  gl.bindBuffer(GL.ARRAY_BUFFER, null)
}

/**
 * @param renderer
 * @param canvas The desired resolution of the canvas in CSS pixels. E.g.,
 *               {w: window.innerWidth, h: window.innerHeight}.
 * @param scale Positive integer zoom.
 * @param focus The position to center on in physical pixels.
 */
function resize(renderer: State, canvas: WH, scale: number, focus: XY): void {
  renderer.gl.canvas.width = canvas.w
  renderer.gl.canvas.height = canvas.h

  // The camera position is a function of the position and the canvas'
  // dimensions.
  //
  // The pixel position is rendered by implicitly truncating the model position.
  // Similarly, it is necessary to truncate the model position prior to camera
  // input to avoid rounding errors that cause the camera to lose synchronicity
  // with the rendered position and create jitter when the position updates.
  //
  // For example, the model position may be 0.1 and the camera at an offset from
  // the position of 100.9. The rendered position is thus truncated to 0.
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
  // As shown above, when truncation is not performed or it occurs afterwards on
  // the sum, rounding errors can cause the rendered distance between the center
  // of the camera and the position to vary under different inputs instead of
  // remaining at a constant offset.
  //
  // The canvas offsets should be truncated by the call the GL.uniform4i() but
  // these appear to use the ceiling instead so another distinct and independent
  // call to Math.trunc() is made.
  const cam = {
    // Center the camera on the x-position within the canvas bounds.
    x: Math.trunc(-focus.x) + Math.trunc(canvas.w / (scale * 2)),
    // Align the y-position with the bottom of the canvas.
    y: Math.trunc(focus.y),
    w: Math.ceil(canvas.w / scale),
    h: Math.ceil(canvas.h / scale)
  }

  // Convert the pixels to clipspace by taking them as a fraction of the cam
  // resolution, scaling to 0-2, flipping the y-coordinate so that positive y is
  // downward, and translating to -1 to 1 and again by the camera position.
  const ratio = {w: 2 / cam.w, h: 2 / cam.h}
  // prettier-ignore
  const projection = new Float32Array([
    ratio.w,        0, 0, -1 + cam.x * ratio.w,
          0, -ratio.h, 0, -1 + cam.y * ratio.h,
          0,        0, 1,                    0,
          0,        0, 0,                    1
  ])
  renderer.gl.uniformMatrix4fv(renderer.projection, false, projection)

  // The viewport is a rendered in physical pixels. It's intentional to use the
  // camera dimensions instead of canvas dimensions since the camera often
  // exceeds the canvas and the viewport's dimensions must be an integer
  // multiple of the camera.
  renderer.gl.viewport(0, 0, scale * cam.w, scale * cam.h)
}

function bufferData(
  gl: GL,
  buffer: GLBuffer,
  data: Int16Array,
  usage: number
): void {
  gl.bindBuffer(GL.ARRAY_BUFFER, buffer)
  gl.bufferData(GL.ARRAY_BUFFER, data, usage)
  gl.bindBuffer(GL.ARRAY_BUFFER, null)
}
