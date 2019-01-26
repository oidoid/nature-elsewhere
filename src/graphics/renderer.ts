import * as fragmentShaderSource from './shader.frag'
import * as shader from './shader'
import * as util from './gl-util'
import * as vertexShaderSource from './shader.vert'

const GL = WebGL2RenderingContext
const perVertexData = new Int16Array([1, 1, 0, 1, 1, 0, 0, 0])

export class Renderer {
  static new(
    canvas: HTMLCanvasElement,
    atlas: HTMLImageElement,
    palettes: HTMLImageElement
  ): Renderer {
    const gl = <GL | null>canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      antialias: false,
      failIfMajorPerformanceCaveat: true,
      lowLatency: true // https://www.chromestatus.com/feature/6360971442388992
    })
    if (!gl) throw new Error('WebGL 2 unsupported.')

    // Allow translucent textures to be layered.
    gl.enable(GL.BLEND)
    gl.blendEquation(GL.FUNC_ADD)
    gl.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

    const program = util.buildProgram(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    )

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
      util.initAttribute(
        gl,
        program,
        attr,
        shader.layout.perVertex.stride,
        shader.layout.perVertex.divisor,
        perVertexBuffer
      )
    )
    util.bufferData(gl, perVertexBuffer, perVertexData, GL.STATIC_READ)

    const perInstanceBuffer = gl.createBuffer()
    shader.layout.perInstance.attributes.forEach(attr =>
      util.initAttribute(
        gl,
        program,
        attr,
        shader.layout.perInstance.stride,
        shader.layout.perInstance.divisor,
        perInstanceBuffer
      )
    )

    // Leave vertexArray bound.

    gl.bindTexture(GL.TEXTURE_2D, util.loadTexture(gl, GL.TEXTURE0, atlas))
    gl.bindTexture(GL.TEXTURE_2D, util.loadTexture(gl, GL.TEXTURE1, palettes))
    // Leave textures bound.

    const loseContext = gl.getExtension('WEBGL_lose_context')

    return new Renderer(
      gl,
      new Float32Array(4 * 4),
      projectionLocation,
      perInstanceBuffer,
      loseContext
    )
  }

  private gl: GL
  private projection: Float32Array
  private projectionLocation: GLUniform
  private perInstanceBuffer: GLBuffer
  private loseContext: GLLoseContext
  private constructor(
    gl: GL,
    projection: Float32Array,
    projectionLocation: GLUniform,
    perInstanceBuffer: GLBuffer,
    loseContext: GLLoseContext
  ) {
    this.gl = gl
    this.projection = projection
    this.projectionLocation = projectionLocation
    this.perInstanceBuffer = perInstanceBuffer
    this.loseContext = loseContext
  }

  /**
   * @arg {WH} canvas The desired resolution of the canvas in CSS pixels. E.g.,
   *                  {w: window.innerWidth, h: window.innerHeight}.
   * @arg {number} scale Positive integer zoom.
   * @return {void}
   */
  render(
    canvas: WH,
    scale: number,
    cam: Rect,
    perInstanceData: GLBufferData,
    instances: number
  ) {
    this.resize(canvas, scale, cam)

    util.bufferData(
      this.gl,
      this.perInstanceBuffer,
      perInstanceData,
      GL.DYNAMIC_READ
    )
    const vertices = perVertexData.length / shader.layout.perVertex.length
    this.gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, vertices, instances)
  }

  isContextLost() {
    return this.gl.isContextLost()
  }

  debugLoseContext() {
    if (!this.loseContext) return
    this.loseContext.loseContext()
  }

  /**
   * @arg {{loseContext: GLLoseContext}} state
   * @return {void}
   */
  debugRestoreContext() {
    if (!this.loseContext) return
    this.loseContext.restoreContext()
  }

  /**
   * @arg {WH} canvas The desired resolution of the canvas in CSS pixels. E.g.,
   *                  {w: window.innerWidth, h: window.innerHeight}.
   * @arg {number} scale Positive integer zoom.
   * @arg {Rect} cam
   * @return {void}
   */
  resize(canvas: WH, scale: number, cam: Rect) {
    this.gl.canvas.width = canvas.w
    this.gl.canvas.height = canvas.h

    // Convert the pixels to clipspace by taking them as a fraction of the cam
    // resolution, scaling to 0-2, flipping the y-coordinate so that positive y is
    // downward, and translating to -1 to 1 and again by the camera position.
    const ratio = {w: 2 / cam.w, h: 2 / cam.h}
    // prettier-ignore
    this.projection.set([
      ratio.w,        0, 0, -1 - cam.x * ratio.w,
            0, -ratio.h, 0,  1 + cam.y * ratio.h,
            0,        0, 1,                    0,
            0,        0, 0,                    1
    ])
    this.gl.uniformMatrix4fv(this.projectionLocation, false, this.projection)

    // The viewport is a rendered in physical pixels. It's intentional to use the
    // camera dimensions instead of canvas dimensions since the camera often
    // exceeds the canvas and the viewport's dimensions must be an integer
    // multiple of the camera.
    this.gl.viewport(0, 0, scale * cam.w, scale * cam.h)
  }
}
