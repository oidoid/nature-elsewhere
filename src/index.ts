import * as Level0 from './levels/level0'
import * as assetsLoader from './assets/asset-loader'
import {toObject, index} from './enum-util'
import * as gfx from './gfx'
import * as vertexShaderSrc from './glsl/main.vert'
import * as fragmentShaderSrc from './glsl/main.frag'

const HEIGHT = 128

function main(window: Window) {
  const canvas = window.document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing in document.')

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: true
  })
  if (!gl) throw new Error('WebGL context unobtainable.')

  // Allow translucent textures to be layered.
  gl.enable(gl.BLEND)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const program = gfx.loadShaderProgram(gl, vertexShaderSrc, fragmentShaderSrc)
  gl.useProgram(program)
  // todo: delete program.

  const resolutionLocation = gfx.getUniformLocation(gl, program, 'uResolution')
  resize(gl, resolutionLocation)
  window.addEventListener('resize', () => resize(gl, resolutionLocation))
  // todo: remove event listener.

  assetsLoader
    .load(toObject(Level0.Texture))
    .then(assets => loop(gl, program, assets))
  // todo: exit.
}

function loop(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  assets: Level0.AssetTexture
): void {
  render(gl, program, assets)
  window.requestAnimationFrame(() => loop(gl, program, assets))
}

function render(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  assets: Level0.AssetTexture
): void {
  gl.clearColor(0.956862745, 0.956862745, 0.929411765, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // Create, bind, and load the texture coordinations.
  const textureCoordsBuffer = gfx.createBuffer(gl)
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
    gl.STATIC_DRAW
  )
  const textureCoordsLocation = gfx.getAttribLocation(
    gl,
    program,
    'aTextureCoords'
  )
  gl.enableVertexAttribArray(textureCoordsLocation)
  gl.vertexAttribPointer(textureCoordsLocation, 2, gl.FLOAT, false, 0, 0)

  // Create, bind, and configure the texture.
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  // Load the image into the texture.
  for (const url of [
    Level0.Texture.WATER,
    Level0.Texture.REFLECTIONS,
    Level0.Texture.POND
  ]) {
    const image = index(assets, url).image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    // Create, bind, and load the vertices.
    const vertexBuffer = gfx.createBuffer(gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    const vertexLocation = gfx.getAttribLocation(gl, program, 'aVertex')
    gl.enableVertexAttribArray(vertexLocation)
    gl.vertexAttribPointer(vertexLocation, 2, gl.UNSIGNED_SHORT, false, 0, 0)
    bufferRectangle(gl, 32, 64, image.width, image.height)

    // Draw.
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    // Clean.
    gl.disableVertexAttribArray(vertexLocation)
    gl.deleteBuffer(vertexBuffer)
  }

  gl.disableVertexAttribArray(textureCoordsLocation)
  gl.deleteBuffer(textureCoordsBuffer)
}

function bufferRectangle(
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const x1 = x + width
  const y1 = y + height
  const vertices = new Uint16Array([x, y, x1, y, x, y1, x, y1, x1, y, x1, y1])
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
}

function resize(
  gl: WebGLRenderingContext,
  resolution: WebGLUniformLocation
): void {
  // The canvas is stretched to the width of the document proportionally.
  // Truncate the width to the lowest integer to so that the canvas height is
  // scaled to be equal to or slightly greater than the document height. If
  // Math.ceil() is used instead, the canvas will often not quite fill the
  // height of the document.
  const ratio = window.innerWidth / window.innerHeight
  const width = Math.trunc(HEIGHT * ratio)

  // eslint-disable-next-line no-console
  console.log(
    `resize: window=${window.innerWidth}x${window.innerHeight} ` +
      `canvas=${width}x${HEIGHT} ` +
      `ratio=${ratio} ` +
      `scale=${window.innerHeight / HEIGHT}`
  )

  gl.canvas.width = width
  gl.canvas.height = HEIGHT

  gl.uniform2f(resolution, width, HEIGHT)
  gl.viewport(0, 0, width, HEIGHT)
}

main(window)
