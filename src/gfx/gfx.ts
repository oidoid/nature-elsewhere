import {GL, GLProgram, GLTexture} from './gl'
import {Assets} from '../assets/asset-loader'

export type GLTextureWrap = 'REPEAT' | 'MIRRORED_REPEAT' | 'CLAMP_TO_EDGE'

export interface Texture {
  texture: GLTexture
  wrap: GLTextureWrap
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
export function createTexture(
  gl: GL,
  wrap: GLTextureWrap = 'MIRRORED_REPEAT'
): GLTexture | null {
  const texture = gl.createTexture()
  const target = gl.TEXTURE_2D
  gl.bindTexture(target, texture)
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl[wrap])
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl[wrap])
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  return texture
}

export interface Drawable {
  location: Point
  bounds: Rectangle
  url: string
}

export function drawTextures(
  gl: GL,
  program: GLProgram | null,
  assets: Assets<any>,
  drawables: Drawable[]
) {
  const DIMENSIONS = 2

  // Create, bind, and load the texture coordinations.
  const textureCoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
  const textureCoordsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW)
  const textureCoordsLocation = gl.getAttribLocation(program, 'aTextureCoords')
  gl.enableVertexAttribArray(textureCoordsLocation)
  gl.vertexAttribPointer(
    textureCoordsLocation,
    DIMENSIONS,
    gl.FLOAT,
    false,
    0,
    0
  )

  // Create, bind, and configure the texture.
  const texture = createTexture(gl)

  const vertexLocation = gl.getAttribLocation(program, 'aVertex')
  gl.enableVertexAttribArray(vertexLocation)
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.vertexAttribPointer(
    vertexLocation,
    DIMENSIONS,
    gl.UNSIGNED_SHORT,
    false,
    0,
    0
  )

  // Load the images into the texture.
  for (const drawable of drawables) {
    const image = assets[drawable.url].image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    bufferRectangle(gl, drawable.location, drawable.bounds)
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
  const vertices = new Uint16Array([x, y, x1, y, x, y1, x, y1, x1, y, x1, y1])
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
}
