import * as Level0 from './levels/level0'
import {index} from './enum-util'

export type GLTextureWrap = 'REPEAT' | 'MIRRORED_REPEAT' | 'CLAMP_TO_EDGE'

export interface Texture {
  texture: WebGLTexture
  wrap: GLTextureWrap
}

/** Creates, binds, and configures a texture. */
export function createTexture(
  gl: WebGLRenderingContext,
  wrap: GLTextureWrap = 'MIRRORED_REPEAT'
): WebGLTexture | null {
  const texture = gl.createTexture()
  const target = gl.TEXTURE_2D
  gl.bindTexture(target, texture)
  gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl[wrap])
  gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl[wrap])
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  return texture
}

export function drawTextures(
  gl: WebGLRenderingContext,
  program: WebGLProgram | null,
  // todo: this should be generic but isn't at the moment for good reason
  assets: Level0.AssetTexture
) {
  // Create, bind, and load the texture coordinations.
  const textureCoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
  const textureCoordsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW)
  const textureCoordsLocation = gl.getAttribLocation(program, 'aTextureCoords')
  gl.enableVertexAttribArray(textureCoordsLocation)
  gl.vertexAttribPointer(textureCoordsLocation, 2, gl.FLOAT, false, 0, 0)

  // Create, bind, and configure the texture.
  const texture = createTexture(gl)

  const vertexLocation = gl.getAttribLocation(program, 'aVertex')
  gl.enableVertexAttribArray(vertexLocation)
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.vertexAttribPointer(vertexLocation, 2, gl.UNSIGNED_SHORT, false, 0, 0)

  // Load the images into the texture.
  for (const url of [
    Level0.Texture.WATER,
    Level0.Texture.REFLECTIONS,
    Level0.Texture.POND
  ]) {
    const image = index(assets, url).image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    bufferRectangle(gl, 32, 64, image.width, image.height)
    const COMPONENTS = 2
    gl.drawArrays(gl.TRIANGLES, 0, textureCoords.length / COMPONENTS)
  }

  // Clean.
  gl.deleteBuffer(vertexBuffer)
  gl.disableVertexAttribArray(vertexLocation)

  gl.deleteTexture(texture)
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
