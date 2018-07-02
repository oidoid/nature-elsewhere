import {GL, GLTexture, GLUniformLocation} from './gl'
import {Assets} from '../assets/asset-loader'
import {Sprite} from '../assets/sprites/sprite'
import {ShaderContext} from './glsl/shader-loader'
import {WH, XYZ, XY, Rect} from '../types/geo'
import * as textureAtlas from '../assets/textures/texture-atlas'

export function render(
  gl: GL,
  ctx: ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: Assets,
  sprites: Sprite[],
  camera: XY,
  bounds: WH,
  minRenderHeight: number // hieght in peixels
): void {
  resize(gl, ctx.location('uViewport'), camera, bounds, minRenderHeight)
  drawTextures(gl, ctx, atlas, assets, sprites)
}

/**
 * Resizes the viewport and Canvas. Scaling is performed proportionally using
 * integer ratios to maintain pixel perfect accuracy which may yield a Canvas
 * slightly larger than window.
 */
function resize(
  gl: GL,
  viewportLocation: GLUniformLocation | null,
  camera: XY,
  bounds: WH,
  minRenderHeight: number
): void {
  // An integer multiple.
  const scale = Math.max(1, Math.floor(bounds.h / minRenderHeight))
  const renderWidth = Math.ceil(bounds.w / scale)
  const renderHeight = Math.ceil(bounds.h / scale)

  // Set the canvas' native dimensions.
  gl.canvas.width = renderWidth
  gl.canvas.height = renderHeight

  // Update the vertex shader's resolution and the viewport within the canvas to
  // use the complete canvas area. For this game, the resolution is so low that
  // the canvas's native dimensions within the window are like a postage stamp
  // on an envelope.
  gl.uniform4f(viewportLocation, camera.x, camera.y, renderWidth, renderHeight)
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

function newAttributeStruct() {
  let stride = 0
  const attrs = [
    {name: 'aAtlasSize', length: 2},
    {name: 'aTextureRect', length: 4},
    {name: 'aTextureUV', length: 2},
    {name: 'aVertex', length: 3},
    {name: 'aTextureScroll', length: 2},
    {name: 'aTextureScale', length: 2}
  ].map(({name, length}) => {
    const attr = {name, length, offset: stride}
    stride += length * Int16Array.BYTES_PER_ELEMENT
    return attr
  })
  return {attrs, stride}
}

function drawTextures(
  gl: GL,
  ctx: ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: Assets,
  sprites: Sprite[]
) {
  // todo: pass shader in and call useprogram here.

  // Create, bind, and configure the texture.
  const texture = createTexture(gl)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // Use a single texture unit for everything currently.
  gl.uniform1i(ctx.location('uTextureUnit'), 0)

  // Create, bind, and load the texture coordinations.
  // todo: this probably only needs to happen once if the mapping is always one
  //       to one.

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  const struct = newAttributeStruct()
  for (const {name, length, offset} of struct.attrs) {
    // stride can move here
    gl.vertexAttribPointer(
      ctx.location(name),
      length,
      gl.SHORT,
      false,
      struct.stride,
      offset
    )
    gl.enableVertexAttribArray(ctx.location(name))
  }

  // Load the images into the texture.
  for (const sprite of sprites) {
    const image = assets[sprite.texture.textureAssetID]
    // todo: this probably doesn't need to happen multiple times every frame.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    const tex =
      atlas.animations[sprite.texture.textureID].cels[sprite.celIndex].bounds

    const textureUV = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 1},
      {x: 1, y: 0},
      {x: 1, y: 1}
    ]
    bufferRectangle(
      gl,
      atlas.size,
      tex,
      textureUV,
      sprite.position,
      sprite.scrollPosition,
      sprite.scale
    )

    gl.drawArrays(gl.TRIANGLES, 0, 3 * 2)
  }

  // Clean.
  gl.deleteBuffer(buffer)
  // gl.disableVertexAttribArray(ctx.location('aVertex'))

  gl.deleteTexture(texture)
}

// yo these will int16s so expect _truncation_
function bufferRectangle(
  gl: GL,
  atlasSize: WH,
  textureRect: Rect,
  textureUV: XY[],
  {x, y, z}: XYZ,
  scroll: XY,
  scale: XY
): void {
  const x1 = x + textureRect.w
  const y1 = y + textureRect.h
  // const common = [z, wh, scroll, scale]
  const vertices = new Int16Array(
    (<number[]>[]).concat(
      addVertex(atlasSize, textureRect, textureUV[0], x, y, z, scroll, scale),
      addVertex(atlasSize, textureRect, textureUV[1], x1, y, z, scroll, scale),
      addVertex(atlasSize, textureRect, textureUV[2], x, y1, z, scroll, scale),
      addVertex(atlasSize, textureRect, textureUV[3], x, y1, z, scroll, scale),
      addVertex(atlasSize, textureRect, textureUV[4], x1, y, z, scroll, scale),
      addVertex(atlasSize, textureRect, textureUV[5], x1, y1, z, scroll, scale)
    )
  )

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
}

function addVertex(
  atlasSize: WH,
  textureRect: Rect,
  textureUV: XY,
  x: number,
  y: number,
  z: number,
  scroll: XY,
  scale: XY
): number[] {
  return [
    atlasSize.w,
    atlasSize.h,
    textureRect.x,
    textureRect.y,
    textureRect.w,
    textureRect.h,
    textureUV.x,
    textureUV.y,
    x,
    y,
    z,
    scroll.x,
    scroll.y,
    scale.x,
    scale.y
  ]
}
