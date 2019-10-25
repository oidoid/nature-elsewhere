import {GLUtil} from './GLUtil'
import {Milliseconds} from 'aseprite-atlas'
import {ReadonlyRect} from '../math/Rect'
import {ShaderLayout} from './ShaderLayout'
import {Store} from '../store/Store'
import {WH} from '../math/WH'
import fragmentGLSL from './fragment.glsl'
import vertexGLSL from './vertex.glsl'

export interface Renderer {
  readonly gl: GL
  readonly instancedArrays: ANGLE_instanced_arrays
  readonly vertexArrayObject: OES_vertex_array_object
  readonly layout: ShaderLayout
  readonly uniforms: Readonly<Record<string, GLUniformLocation>>
  readonly attributes: Readonly<Record<string, number>>
  readonly projection: Float32Array
  readonly perInstanceBuffer: GLBuffer
  readonly loseContext: GLLoseContext
}

const GL = WebGLRenderingContext
const uv: Int16Array = new Int16Array(Object.freeze([1, 1, 0, 1, 1, 0, 0, 0]))
const uvLen: number = uv.length / 2 // dimensions

export namespace Renderer {
  export function make(
    canvas: HTMLCanvasElement,
    atlas: HTMLImageElement,
    layout: ShaderLayout
  ): Renderer {
    const gl = canvas.getContext('webgl', {
      alpha: false,
      depth: false,
      antialias: false,
      // https://www.chromestatus.com/feature/6360971442388992
      lowLatency: true
    })
    if (!(gl instanceof GL)) throw new Error('WebGL unsupported.')

    const instancedArrays = gl.getExtension('ANGLE_instanced_arrays')
    if (!instancedArrays) throw new Error('ANGLE_instanced_arrays unsupported.')
    const vertexArrayObject = gl.getExtension('OES_vertex_array_object')
    if (!vertexArrayObject)
      throw new Error('OES_vertex_array_object unsupported.')

    // Avoid initial color flash by matching the background. [palette]
    gl.clearColor(0xf2 / 0xff, 0xf5 / 0xff, 0xf5 / 0xff, 1)
    gl.clear(GL.COLOR_BUFFER_BIT)

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

    const vertexArray = vertexArrayObject.createVertexArrayOES()
    vertexArrayObject.bindVertexArrayOES(vertexArray)

    const perVertexBuffer = gl.createBuffer()
    for (const attr of layout.perVertex.attributes)
      GLUtil.initAttribute(
        gl,
        instancedArrays,
        layout.perVertex.stride,
        layout.perVertex.divisor,
        perVertexBuffer,
        attributes[attr.name],
        attr
      )
    GLUtil.bufferData(gl, perVertexBuffer, uv, GL.STATIC_DRAW)

    const perInstanceBuffer = gl.createBuffer()
    for (const attr of layout.perInstance.attributes)
      GLUtil.initAttribute(
        gl,
        instancedArrays,
        layout.perInstance.stride,
        layout.perInstance.divisor,
        perInstanceBuffer,
        attributes[attr.name],
        attr
      )

    // Leave vertexArray bound.

    gl.bindTexture(GL.TEXTURE_2D, GLUtil.loadTexture(gl, GL.TEXTURE0, atlas))
    // Leave texture bound.

    return {
      gl,
      instancedArrays,
      vertexArrayObject,
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
    renderer: Renderer,
    time: Milliseconds,
    canvasWH: WH,
    scale: number,
    cam: ReadonlyRect,
    {dat, len}: Store
  ): void {
    resize(renderer, canvasWH, scale, cam)
    renderer.gl.uniform1i(
      renderer.uniforms[renderer.layout.uniforms.time],
      time
    )
    const perInstanceBuffer = renderer.perInstanceBuffer
    GLUtil.bufferData(renderer.gl, perInstanceBuffer, dat, GL.DYNAMIC_DRAW)
    renderer.instancedArrays.drawArraysInstancedANGLE(
      GL.TRIANGLE_STRIP,
      0,
      uvLen,
      len
    )
  }

  /** @arg canvasWH The desired resolution of the canvas in CSS pixels. E.g.,
                    {w: window.innerWidth, h: window.innerHeight}.
      @arg scale Positive integer zoom. */
  export function resize(
    {gl, layout, uniforms, projection}: Renderer,
    canvasWH: Readonly<WH>,
    scale: number,
    cam: ReadonlyRect
  ): void {
    ;({w: gl.canvas.width, h: gl.canvas.height} = canvasWH)

    projection.set(project(cam))
    gl.uniformMatrix4fv(uniforms[layout.uniforms.projection], false, projection)

    // The viewport is a rendered in physical pixels. It's intentional to use
    // the camera dimensions instead of canvas dimensions since the camera often
    // exceeds the canvas and the viewport's dimensions must be an integer
    // multiple of the camera. The negative consequence is that the first pixel
    // on the y-axis and last pixel on the x-axis may be partly truncated.
    gl.viewport(0, 0, scale * cam.size.w, scale * cam.size.h)
  }

  function project(cam: ReadonlyRect): readonly number[] {
    // Convert the pixels to clipspace by taking them as a fraction of the cam
    // resolution, scaling to 0-2, flipping the y-coordinate so that positive y
    // is downward, and translating to -1 to 1 and again by the camera position.
    const {w, h} = {w: 2 / cam.size.w, h: 2 / cam.size.h}
    return [
      w,  0, 0, -1 - cam.position.x * w,
      0, -h, 0,  1 + cam.position.y * h,
      0,  0, 1,              0,
      0,  0, 0,              1
    ] // prettier-ignore
  }
}
