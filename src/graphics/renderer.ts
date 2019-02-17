import * as fragmentShaderSource from './shader.frag'
import * as shader from './shader'
import * as util from './gl-util'
import * as vertexShaderSource from './shader.vert'

const GL = WebGL2RenderingContext
const perVertexData: Int16Array = new Int16Array([1, 1, 0, 1, 1, 0, 0, 0])

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

  private constructor(
    private readonly _gl: GL,
    private readonly _projection: Float32Array,
    private readonly _projectionLocation: GLUniform,
    private readonly _perInstanceBuffer: GLBuffer,
    private readonly _loseContext: GLLoseContext
  ) {
    this._gl = _gl
    this._projection = _projection
    this._projectionLocation = _projectionLocation
    this._perInstanceBuffer = _perInstanceBuffer
    this._loseContext = _loseContext
  }

  /**
   * @arg canvas The desired resolution of the canvas in CSS pixels. E.g.,
   *             {w: window.innerWidth, h: window.innerHeight}.
   * @arg scale Positive integer zoom.
   */
  render(
    canvas: WH,
    scale: number,
    cam: Rect,
    perInstanceData: GLBufferData,
    instances: number
  ): void {
    this.resize(canvas, scale, cam)

    util.bufferData(
      this._gl,
      this._perInstanceBuffer,
      perInstanceData,
      GL.DYNAMIC_READ
    )
    const vertices = perVertexData.length / shader.layout.perVertex.length
    this._gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, vertices, instances)
  }

  debugLoseContext(): void {
    if (!this._loseContext) return
    this._loseContext.loseContext()
  }

  debugRestoreContext(): void {
    if (!this._loseContext) return
    this._loseContext.restoreContext()
  }

  /**
   * @arg canvas The desired resolution of the canvas in CSS pixels. E.g.,
   *             {w: window.innerWidth, h: window.innerHeight}.
   * @arg scale Positive integer zoom.
   */
  resize(canvas: WH, scale: number, cam: Rect): void {
    this._gl.canvas.width = canvas.w
    this._gl.canvas.height = canvas.h

    // Convert the pixels to clipspace by taking them as a fraction of the cam
    // resolution, scaling to 0-2, flipping the y-coordinate so that positive y
    // is downward, and translating to -1 to 1 and again by the camera position.
    const ratio = {w: 2 / cam.w, h: 2 / cam.h}
    // prettier-ignore
    this._projection.set([
      ratio.w,        0, 0, -1 - cam.x * ratio.w,
            0, -ratio.h, 0,  1 + cam.y * ratio.h,
            0,        0, 1,                    0,
            0,        0, 0,                    1
    ])
    this._gl.uniformMatrix4fv(this._projectionLocation, false, this._projection)

    // The viewport is a rendered in physical pixels. It's intentional to use
    // the camera dimensions instead of canvas dimensions since the camera often
    // exceeds the canvas and the viewport's dimensions must be an integer
    // multiple of the camera.
    this._gl.viewport(0, 0, scale * cam.w, scale * cam.h)
  }
}
