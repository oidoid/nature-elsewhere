import {GL, GLTexture} from './gl'
import {Assets} from '../assets/asset-loader'
import {Sprite} from '../assets/levels/sprite'
import {ShaderContext} from './glsl/shader-loader'
import {WH, XY} from '../geo'
import * as textureAtlas from '../assets/textures/texture-atlas'

export interface Texture {
  texture: GLTexture
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

let textureOffset = {x: 0, y: 0}

export function drawTextures(
  gl: GL,
  ctx: ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: Assets<any>,
  sprites: Sprite[],
  step: number
) {
  const DIMENSIONS = 2

  // todo: pass shader in and call useprogram here.

  // Create, bind, and configure the texture.
  const texture = createTexture(gl)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // Use a single texture unit for everything currently.
  gl.uniform1i(ctx.location('uTexture'), 0)

  // Create, bind, and load the texture coordinations.
  // todo: this probably only needs to happen once if the mapping is always one
  //       to one.
  const textureCoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
  const textureCoordsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.STATIC_DRAW)

  gl.vertexAttribPointer(
    ctx.location('aTextureCoords'),
    DIMENSIONS,
    gl.FLOAT,
    false,
    0,
    0
  )
  gl.enableVertexAttribArray(ctx.location('aTextureCoords'))

  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  // Load the images into the texture.
  for (const sprite of sprites) {
    const image = assets[sprite.textureURL].image
    // todo: this probably doesn't need to happen multiple times every frame.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    if (sprite.textureOffset) {
      textureOffset = {
        x: textureOffset.x + step * sprite.textureOffset.x,
        y: textureOffset.y + step * sprite.textureOffset.y
      }
    }

    const tex = atlas.animations[sprite.textureID].cels[0].texture

    const offset = sprite.textureOffset ? textureOffset : {x: 0, y: 0}
    gl.uniform2f(ctx.location('uTextureOffset'), offset.x, offset.y)
    bufferRectangle(gl, sprite.position, {w: tex.w, h: tex.h})

    gl.uniform2f(ctx.location('uAtlasBounds'), atlas.size.w, atlas.size.h)

    gl.uniform2f(ctx.location('uTextureBounds'), tex.w, tex.h)

    gl.uniform2f(ctx.location('uTexturePosition'), tex.x, tex.y)

    const stride = 1 * DIMENSIONS * Float32Array.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(
      ctx.location('aVertex'),
      DIMENSIONS,
      gl.FLOAT,
      false,
      stride,
      0
    )
    gl.enableVertexAttribArray(ctx.location('aVertex'))

    gl.drawArrays(gl.TRIANGLES, 0, textureCoords.length / DIMENSIONS)
  }

  // Clean.
  gl.deleteBuffer(vertexBuffer)
  gl.disableVertexAttribArray(ctx.location('aVertex'))

  gl.deleteTexture(texture)
  gl.disableVertexAttribArray(ctx.location('aTextureCoords'))
  gl.deleteBuffer(textureCoordsBuffer)
}

function bufferRectangle(gl: GL, {x, y}: XY, {w, h}: WH): void {
  const x1 = x + w
  const y1 = y + h
  const vertices = new Float32Array([x, y, x1, y, x, y1, x, y1, x1, y, x1, y1])
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
}
