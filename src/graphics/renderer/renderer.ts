import fragmentGLSL from '../shaders/fragment.glsl'
import * as glConfig from './gl-config.json'
import * as GLUtil from '../gl-util'
import {StoreUpdate} from '../../store/store'
import vertexGLSL from '../shaders/vertex.glsl'

export type State = Readonly<{
  gl: GL
  layout: ShaderLayout
  uniforms: Readonly<Record<string, GLUniformLocation>>
  attributes: Readonly<Record<string, number>>
  projection: Float32Array
  perInstanceBuffer: GLBuffer
  loseContext: GLLoseContext
}>

const GL = WebGL2RenderingContext
const vertices: Int16Array = new Int16Array(
  Object.freeze([1, 1, 0, 1, 1, 0, 0, 0])
)

export function make(
  canvas: HTMLCanvasElement,
  atlas: HTMLImageElement,
  layout: ShaderLayout
): State {
  const gl = canvas.getContext('webgl2', glConfig)
  if (!(gl instanceof GL)) throw new Error('WebGL 2 unsupported.')

  // Allow transparent textures to be layered.
  gl.enable(GL.BLEND)
  gl.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

  // Disable image colorspace conversions. The default is browser dependent.
  gl.pixelStorei(GL.UNPACK_COLORSPACE_CONVERSION_WEBGL, false)

  const program = GLUtil.loadProgram(gl, vertexGLSL, fragmentGLSL)
  const uniforms = GLUtil.uniformLocations(gl, program)

  gl.uniform1i(uniforms[layout.uniforms.atlas], 0)
  gl.uniform2i(
    uniforms[layout.uniforms.atlasSize],
    atlas.naturalWidth,
    atlas.naturalHeight
  )

  const attributes = GLUtil.attributeLocations(gl, program)

  const vertexArray = gl.createVertexArray()
  gl.bindVertexArray(vertexArray)

  const perVertexBuffer = gl.createBuffer()
  layout.perVertex.attributes.forEach(attr =>
    GLUtil.initAttribute(
      gl,
      layout.perVertex.stride,
      layout.perVertex.divisor,
      perVertexBuffer,
      attributes[attr.name],
      attr
    )
  )
  GLUtil.bufferData(gl, perVertexBuffer, vertices, GL.STATIC_READ)

  const perInstanceBuffer = gl.createBuffer()
  layout.perInstance.attributes.forEach(attr =>
    GLUtil.initAttribute(
      gl,
      layout.perInstance.stride,
      layout.perInstance.divisor,
      perInstanceBuffer,
      attributes[attr.name],
      attr
    )
  )

  // Leave vertexArray bound.

  gl.bindTexture(GL.TEXTURE_2D, GLUtil.loadTexture(gl, GL.TEXTURE0, atlas))
  // Leave texture bound.

  return {
    gl,
    layout,
    uniforms,
    attributes,
    projection: new Float32Array(4 * 4),
    perInstanceBuffer,
    loseContext: gl.getExtension('WEBGL_lose_context')
  }
}

/**
 * @arg canvasWH The desired resolution of the canvas in CSS pixels. E.g.,
 *               {w: window.innerWidth, h: window.innerHeight}.
 * @arg scale Positive integer zoom.
 */
export function render(
  state: State,
  canvasWH: WH,
  scale: number,
  cam: Rect,
  {data, len}: StoreUpdate
): void {
  resize(state, canvasWH, scale, cam)
  const perInstanceBuffer = state.perInstanceBuffer
  GLUtil.bufferData(state.gl, perInstanceBuffer, data, GL.DYNAMIC_READ)
  const verticesLen = vertices.length / state.layout.perVertex.length
  state.gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, verticesLen, len)
}

/**
 * @arg canvasWH The desired resolution of the canvas in CSS pixels. E.g.,
 *               {w: window.innerWidth, h: window.innerHeight}.
 * @arg scale Positive integer zoom.
 */
function resize(
  {gl, layout, uniforms, projection}: State,
  canvasWH: WH,
  scale: number,
  cam: Rect
): void {
  gl.canvas.width = canvasWH.w
  gl.canvas.height = canvasWH.h

  // Convert the pixels to clipspace by taking them as a fraction of the cam
  // resolution, scaling to 0-2, flipping the y-coordinate so that positive y is
  // downward, and translating to -1 to 1 and again by the camera position.
  const ratio = {w: 2 / cam.w, h: 2 / cam.h}
  // prettier-ignore
  projection.set([
    ratio.w,        0, 0, -1 - cam.x * ratio.w,
          0, -ratio.h, 0,  1 + cam.y * ratio.h,
          0,        0, 1,                    0,
          0,        0, 0,                    1
  ])
  gl.uniformMatrix4fv(uniforms[layout.uniforms.projection], false, projection)

  // The viewport is a rendered in physical pixels. It's intentional to use the
  // camera dimensions instead of canvas dimensions since the camera often
  // exceeds the canvas and the viewport's dimensions must be an integer
  // multiple of the camera.
  gl.viewport(0, 0, scale * cam.w, scale * cam.h)
}
