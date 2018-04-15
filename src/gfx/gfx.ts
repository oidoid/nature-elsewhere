import {GL, GLTexture} from './gl'
import {Assets} from '../assets/asset-loader'
import {Level0} from '../levels/level0'
import {ShaderContext} from './glsl/shader-loader'

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
  ctx: ShaderContext,
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

  gl.vertexAttribPointer(
    ctx.attr.aTextureCoords,
    DIMENSIONS,
    gl.FLOAT,
    false,
    0,
    0
  )
  gl.enableVertexAttribArray(ctx.attr.aTextureCoords)

  // Create, bind, and configure the texture.
  const texture = createTexture(gl)

  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

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
    const offset = drawable.textureOffset ? textureOffset : {x: 0, y: 0}
    gl.uniform2f(ctx.uniform.uTextureOffset, offset.x, offset.y)
    bufferRectangle(gl, drawable.location, drawable.bounds)

    gl.uniform2f(
      ctx.uniform.uAtlasBounds,
      Level0.Map.atlasBounds.x,
      Level0.Map.atlasBounds.y
    )

    gl.uniform2f(
      ctx.uniform.uTextureBounds,
      drawable.bounds.width,
      drawable.bounds.height
    )

    gl.uniform2f(
      ctx.uniform.uTexturePosition,
      drawable.texturePosition.x,
      drawable.texturePosition.y
    )

    const stride = 1 * DIMENSIONS * Float32Array.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(
      ctx.attr.aVertex,
      DIMENSIONS,
      gl.FLOAT,
      false,
      stride,
      0
    )
    gl.enableVertexAttribArray(ctx.attr.aVertex)

    gl.drawArrays(gl.TRIANGLES, 0, textureCoords.length / DIMENSIONS)
  }

  // Clean.
  gl.deleteBuffer(vertexBuffer)
  gl.disableVertexAttribArray(ctx.attr.aVertex)

  gl.deleteTexture(texture)
  gl.disableVertexAttribArray(ctx.attr.aTextureCoords)
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
