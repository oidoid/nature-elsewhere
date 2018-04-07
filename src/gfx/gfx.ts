import {GL, GLProgram, GLTexture} from './gl'
import {Assets} from '../assets/asset-loader'
import {Level0} from '../levels/level0'

export interface Texture {
  texture: GLTexture
}

interface Point {
  x: number
  y: number
}

interface Rectangle {
  width: number
  height: number
}

/** Creates, binds, and configures a texture. */
export function createTexture(gl: GL): GLTexture | null {
  const texture = gl.createTexture()
  const target = gl.TEXTURE_2D
  gl.bindTexture(target, texture)
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  return texture
}

export interface Drawable {
  location: Point
  bounds: Rectangle
  url: string
  textureOffset?: Point
  texturePosition: Point
}

let textureOffset = {x: 0, y: 0}

export function drawTextures(
  gl: GL,
  program: GLProgram | null,
  assets: Assets<any>,
  drawables: Drawable[],
  step: number
) {
  const DIMENSIONS = 2

  // uesprogram

  // Create, bind, and load the texture coordinations.
  const textureCoords = new Float32Array([
    0,
    0,
    128,
    0,
    0,
    16,
    0,
    16,
    128,
    0,
    128,
    16
  ])
  const textureCoordsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW)

  const textureCoordsLocation = gl.getAttribLocation(program, 'aTextureCoords')
  gl.vertexAttribPointer(
    textureCoordsLocation,
    DIMENSIONS,
    gl.FLOAT,
    false,
    0,
    0
  )
  gl.enableVertexAttribArray(textureCoordsLocation)

  // Create, bind, and configure the texture.
  const texture = createTexture(gl)

  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  const vertexLocation = gl.getAttribLocation(program, 'aVertex')

  // Load the images into the texture.
  for (const drawable of drawables) {
    const image = assets[drawable.url].image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    if (drawable.textureOffset) {
      textureOffset = {
        x: textureOffset.x + step * drawable.textureOffset.x,
        y: textureOffset.y + step * drawable.textureOffset.y
      }
    }
    const textureOffsetLocation = gl.getUniformLocation(
      program,
      'uTextureOffset'
    )
    const offset = drawable.textureOffset ? textureOffset : {x: 0, y: 0}
    gl.uniform2f(textureOffsetLocation, offset.x, offset.y)
    bufferRectangle(gl, drawable.location, drawable.bounds)

    const atlasBoundsLocation = gl.getUniformLocation(program, 'uAtlasBounds')
    gl.uniform2f(
      atlasBoundsLocation,
      Level0.Map.atlasBounds.x,
      Level0.Map.atlasBounds.y
    )

    const textureBoundsLocation = gl.getUniformLocation(
      program,
      'uTextureBounds'
    )
    gl.uniform2f(
      textureBoundsLocation,
      drawable.bounds.width,
      drawable.bounds.height
    )

    const texturePositionLocation = gl.getUniformLocation(
      program,
      'uTexturePosition'
    )
    gl.uniform2f(
      texturePositionLocation,
      drawable.texturePosition.x,
      drawable.texturePosition.y
    )

    const stride = 1 * DIMENSIONS * Float32Array.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(
      vertexLocation,
      DIMENSIONS,
      gl.FLOAT,
      false,
      stride,
      0
    )
    gl.enableVertexAttribArray(vertexLocation)

    gl.drawArrays(gl.TRIANGLES, 0, textureCoords.length / DIMENSIONS)
  }

  // Clean.
  gl.deleteBuffer(vertexBuffer)
  gl.disableVertexAttribArray(vertexLocation)

  gl.deleteTexture(texture)
  gl.disableVertexAttribArray(textureCoordsLocation)
  gl.deleteBuffer(textureCoordsBuffer)
}

function bufferRectangle(
  gl: GL,
  {x, y}: Point,
  {width, height}: Rectangle
): void {
  const x1 = x + width
  const y1 = y + height
  const vertices = new Float32Array([x, y, x1, y, x, y1, x, y1, x1, y, x1, y1])
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
}
