import {GL, GLUtil} from '../gl-util'
import * as glConfig from './gl-config.json'
import {ShaderCache} from '../shaders/shader-cache'
import {Shader} from '../shaders/shader'
import fragmentGLSL from '../shaders/fragment.glsl'
import vertexGLSL from '../shaders/vertex.glsl'

const perVertexData: Int16Array = new Int16Array(
  Object.freeze([1, 1, 0, 1, 1, 0, 0, 0])
)

export class Renderer {
  static new(
    canvas: HTMLCanvasElement,
    atlas: HTMLImageElement,
    palette: HTMLImageElement
  ): Renderer {
    const gl = canvas.getContext('webgl2', glConfig)
    if (!(gl instanceof GL)) throw new Error('WebGL 2 unsupported.')

    // Allow translucent textures to be layered.
    gl.enable(GL.BLEND)
    gl.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

    // Disable image colorspace conversions. The default is browser dependent.
    gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, false)

    const program = GLUtil.buildProgram(gl, vertexGLSL, fragmentGLSL)
    const shaderCache = ShaderCache.new(gl, program)

    gl.uniform1i(shaderCache.location(Shader.Variable.ATLAS), 0)
    gl.uniform2i(
      shaderCache.location(Shader.Variable.ATLAS_SIZE),
      atlas.naturalWidth,
      atlas.naturalHeight
    )
    gl.uniform1i(shaderCache.location(Shader.Variable.PALETTE), 1)
    gl.uniform2i(
      shaderCache.location(Shader.Variable.PALETTE_SIZE),
      palette.naturalWidth,
      palette.naturalHeight
    )

    const vertexArray = gl.createVertexArray()
    gl.bindVertexArray(vertexArray)

    const perVertexBuffer = gl.createBuffer()
    Shader.layout.perVertex.attributes.forEach(attr =>
      GLUtil.initAttribute(
        gl,
        program,
        attr,
        Shader.layout.perVertex.stride,
        Shader.layout.perVertex.divisor,
        perVertexBuffer
      )
    )
    GLUtil.bufferData(gl, perVertexBuffer, perVertexData, GL.STATIC_READ)

    const perInstanceBuffer = gl.createBuffer()
    Shader.layout.perInstance.attributes.forEach(attr =>
      GLUtil.initAttribute(
        gl,
        program,
        attr,
        Shader.layout.perInstance.stride,
        Shader.layout.perInstance.divisor,
        perInstanceBuffer
      )
    )

    // Leave vertexArray bound.

    gl.bindTexture(GL.TEXTURE_2D, GLUtil.loadTexture(gl, GL.TEXTURE0, atlas))
    gl.bindTexture(GL.TEXTURE_2D, GLUtil.loadTexture(gl, GL.TEXTURE1, palette))
    // Leave textures bound.

    const loseContext = gl.getExtension('WEBGL_lose_context')

    return new Renderer(
      gl,
      shaderCache,
      new Float32Array(4 * 4),
      perInstanceBuffer,
      loseContext
    )
  }

  private constructor(
    private readonly _gl: GL,
    private readonly _shaderCache: ShaderCache,
    private readonly _projection: Float32Array,
    private readonly _perInstanceBuffer: GLBuffer,
    private readonly _loseContext: GLLoseContext
  ) {}

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

    GLUtil.bufferData(
      this._gl,
      this._perInstanceBuffer,
      perInstanceData,
      GL.DYNAMIC_READ
    )
    const vertices = perVertexData.length / Shader.layout.perVertex.length
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
    // resolution, scaling to 0-2, flipping the y-coordinate so that positive y is
    // downward, and translating to -1 to 1 and again by the camera position.
    const ratio = {w: 2 / cam.w, h: 2 / cam.h}
    // prettier-ignore
    this._projection.set([
      ratio.w,        0, 0, -1 - cam.x * ratio.w,
            0, -ratio.h, 0,  1 + cam.y * ratio.h,
            0,        0, 1,                    0,
            0,        0, 0,                    1
    ])
    this._gl.uniformMatrix4fv(
      this._shaderCache.location(Shader.Variable.PROJECTION),
      false,
      this._projection
    )

    // The viewport is a rendered in physical pixels. It's intentional to use the
    // camera dimensions instead of canvas dimensions since the camera often
    // exceeds the canvas and the viewport's dimensions must be an integer
    // multiple of the camera.
    this._gl.viewport(0, 0, scale * cam.w, scale * cam.h)
  }
}
