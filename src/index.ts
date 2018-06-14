import {Level0, PLAYER} from './assets/levels/level0'
import * as assetsLoader from './assets/asset-loader'
import * as shaderLoader from './gfx/glsl/shader-loader'
import * as gfx from './gfx/gfx'
import {check, GL, GLUniformLocation} from './gfx/gl'
import * as vertexSrc from './gfx/glsl/main.vert'
import * as fragmentSrc from './gfx/glsl/main.frag'
import * as kbd from './input/kbd'
import * as Aseprite from './assets/textures/aseprite'
import * as textureAtlas from './assets/textures/texture-atlas'
import * as atlasJSON from './assets/textures/atlas.json'
import {ASSET_URL, TEXTURE} from './assets/textures/texture'
import * as palette from './assets/levels/palette'

const HEIGHT = 192

function main(window: Window) {
  const canvas = window.document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing in document.')

  document.body.style.background = `rgba(${palette.base.r * 255}, ${palette.base
    .g * 255}, ${palette.base.b * 255}, ${palette.base.a})`

  const gl = check(
    canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: true
    })
  )

  // Allow translucent textures to be layered.
  gl.enable(gl.BLEND)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const ctx = shaderLoader.load(gl, vertexSrc, fragmentSrc)
  gl.useProgram(ctx.program)

  document.addEventListener('keydown', event => {
    const btn = kbd.defaultControllerMap[event.key.toLowerCase()]
    // eslint-disable-next-line no-console
    console.log(`${event.key} => ${btn}`)
    switch (btn) {
      case 'left':
        // flip
        PLAYER.position.x -= 1
        PLAYER.texture = TEXTURE.PLAYER_WALK
        PLAYER.celIndex = (PLAYER.celIndex + 1) % 2
        break
      case 'right':
        PLAYER.position.x += 1
        PLAYER.texture = TEXTURE.PLAYER_WALK
        PLAYER.celIndex = (PLAYER.celIndex + 1) % 2
        break
      case 'up':
        break
      case 'down':
        PLAYER.texture = TEXTURE.PLAYER_IDLE
        PLAYER.celIndex = 0
        break
      case 'zap':
        break
      case 'menu':
        break
      default:
        break
    }
  })

  const atlas = textureAtlas.unmarshal(<Aseprite.File>atlasJSON)
  assetsLoader
    .load(ASSET_URL)
    .then(assets => loop(gl, ctx, atlas, assets, Date.now()))
  // todo: exit and remove key EventListener.
}

function resize(gl: GL, resolutionLocation: GLUniformLocation | null): void {
  const scale = Math.max(1, Math.floor(window.innerHeight / RENDER_HEIGHT))

  const renderWidth = Math.round(window.innerWidth / scale)
  gl.canvas.width = renderWidth
  gl.canvas.height = RENDER_HEIGHT
  gl.uniform2f(resolutionLocation, renderWidth, RENDER_HEIGHT)
  gl.viewport(0, 0, renderWidth, RENDER_HEIGHT)

  const scaledWidth = renderWidth * scale
  const scaledHeight = RENDER_HEIGHT * scale
  gl.canvas.style.width = `${scaledWidth}px`
  gl.canvas.style.height = `${scaledHeight}px`
}

function loop(
  gl: GL,
  ctx: shaderLoader.ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: assetsLoader.Assets,
  timestamp: number
): void {
  const now = Date.now()
  window.requestAnimationFrame(() => loop(gl, ctx, atlas, assets, now))

  resize(gl, ctx.location('uResolution'))

  const step = (now - timestamp) / 1000
  render(gl, ctx, atlas, assets, step)
}

function render(
  gl: GL,
  ctx: shaderLoader.ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: assetsLoader.Assets,
  step: number
): void {
  const {r, g, b, a} = Level0.Map.backgroundColor
  gl.clearColor(r, g, b, a)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gfx.drawTextures(gl, ctx, atlas, assets, Level0.Map.sprites, step)
}

main(window)
