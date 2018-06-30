import {GL, GLTexture, GLUniformLocation} from './gl'
import {Assets} from '../assets/asset-loader'
import {Sprite} from '../assets/sprites/sprite'
import {ShaderContext} from './glsl/shader-loader'
import {WH, XYZ} from '../types/geo'
import * as textureAtlas from '../assets/textures/texture-atlas'

export function render(
  gl: GL,
  ctx: ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: Assets,
  sprites: Sprite[],
  minRenderHeight: number // hieght in peixels
): void {
  resize(
    gl,
    ctx.location('uViewport.resolution'),
    {w: window.innerWidth, h: window.innerHeight},
    minRenderHeight
  )
  drawTextures(gl, ctx, atlas, assets, sprites)
}

/**
 * Resizes the viewport and Canvas. Scaling is performed proportionally using
 * integer ratios to maintain pixel perfect accuracy which may yield a Canvas
 * slightly larger than window.
 */
function resize(
  gl: GL,
  resolutionLocation: GLUniformLocation | null,
  window: WH,
  minRenderHeight: number
): void {
  // An integer multiple.
  const scale = Math.max(1, Math.floor(window.h / minRenderHeight))
  const renderHeight = Math.ceil(window.h / scale)
  const renderWidth = Math.ceil(window.w / scale)

  // Set the canvas' native dimensions.
  gl.canvas.width = renderWidth
  gl.canvas.height = renderHeight

  // Update the vertex shader's resolution and the viewport within the canvas to
  // use the complete canvas area. For this game, the resolution is so low that
  // the canvas's native dimensions within the window are like a postage stamp
  // on an envelope.
  gl.uniform2f(resolutionLocation, renderWidth, renderHeight)
  gl.viewport(0, 0, renderWidth, renderHeight)

  // Uniformly stretch the canvas to the window's bounds. Continuing the
  // metaphor of the previous comment, the stamp now covers the envelope. These
  // dimensions may slightly exceed the bounds to retain pixel perfect scaling.
  // Excess is cropped from the lower-right corner. The maximum excess is equal
  // to `scale` pixels in both axes.
  const scaledWidth = renderWidth * scale
  const scaledHeight = renderHeight * scale
  gl.canvas.style.width = `${scaledWidth}px`
  gl.canvas.style.height = `${scaledHeight}px`
}

/** Creates, binds, and configures a texture. */
function createTexture(gl: GL): GLTexture | null {
  const texture = gl.createTexture()
  const target = gl.TEXTURE_2D
  gl.bindTexture(target, texture)
  gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  return texture
}

function drawTextures(
  gl: GL,
  ctx: ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: Assets,
  sprites: Sprite[]
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
    const image = assets[sprite.texture.textureAssetID]
    // todo: this probably doesn't need to happen multiple times every frame.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    const tex =
      atlas.animations[sprite.texture.textureID].cels[sprite.celIndex].bounds

    bufferRectangle(gl, sprite.position, {w: tex.w, h: tex.h})

    gl.uniform2f(
      ctx.location('uTextureScroll'),
      sprite.scrollPosition.x,
      sprite.scrollPosition.y
    )

    gl.uniform2f(ctx.location('uScale'), sprite.scale.x, sprite.scale.y)

    gl.uniform2f(ctx.location('uAtlasBounds'), atlas.size.w, atlas.size.h)

    gl.uniform2f(ctx.location('uTextureBounds'), tex.w, tex.h)

    gl.uniform2f(ctx.location('uTexturePosition'), tex.x, tex.y)

    const stride = 1 * (DIMENSIONS + 1) * Float32Array.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(
      ctx.location('aVertex'),
      DIMENSIONS + 1,
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

function bufferRectangle(gl: GL, {x, y, z}: XYZ, {w, h}: WH): void {
  const x1 = x + w
  const y1 = y + h
  const vertices = new Float32Array([
    x,
    y,
    z,
    x1,
    y,
    z,
    x,
    y1,
    z,
    x,
    y1,
    z,
    x1,
    y,
    z,
    x1,
    y1,
    z
  ])
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
}
