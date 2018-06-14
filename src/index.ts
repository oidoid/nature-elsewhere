import {Level0, PLAYER} from './assets/levels/level0'
import * as assetsLoader from './assets/asset-loader'
import * as shaderLoader from './gfx/glsl/shader-loader'
import * as gfx from './gfx/gfx'
import {check, GL, GLUniformLocation} from './gfx/gl'
import * as vertexSrc from './gfx/glsl/main.vert'
import * as fragmentSrc from './gfx/glsl/main.frag'
import * as keyboard from './input/keyboard'
import * as Aseprite from './assets/textures/aseprite'
import * as textureAtlas from './assets/textures/texture-atlas'
import * as atlasJSON from './assets/textures/atlas.json'
import {ASSET_URL, TEXTURE} from './assets/textures/texture'
import {Action, ActionState} from './input/action'

// The minimum render height and expected minimum render width. The maximum
// render height is 2 * MIN_RENDER_SIZE - 1. There is no minimum or maximum
// render width.
const MIN_RENDER_HEIGHT = 128
const actionState: ActionState = Object.assign(
  {},
  ...Object.values(Action).map(action => ({[action]: false}))
)

function main(window: Window) {
  const canvas = window.document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing in document.')

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

  const onKeyChange = (event: KeyboardEvent) => {
    const action = keyboard.DEFAULT_KEY_MAP[event.key]
    const active = event.type === 'keydown'
    actionState[action] = active
  }
  document.addEventListener('keydown', onKeyChange)
  document.addEventListener('keyup', onKeyChange)

  const atlas = textureAtlas.unmarshal(<Aseprite.File>atlasJSON)
  assetsLoader
    .load(ASSET_URL)
    .then(assets => loop(gl, ctx, atlas, assets, Date.now()))
  // todo: exit and remove key EventListener.
}

function resize(gl: GL, resolutionLocation: GLUniformLocation | null): void {
  // An integer multiple.
  const scale = Math.max(1, Math.floor(window.innerHeight / MIN_RENDER_HEIGHT))
  const renderHeight = Math.ceil(window.innerHeight / scale)
  const renderWidth = Math.ceil(window.innerWidth / scale)

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

  const pps = 16 * step
  if (actionState[Action.LEFT]) {
    // flip
    PLAYER.position.x -= pps
    PLAYER.texture = TEXTURE.PLAYER_WALK
    PLAYER.celIndex = (PLAYER.celIndex + 1) % 2
  }
  if (actionState[Action.RIGHT]) {
    PLAYER.position.x += pps
    PLAYER.texture = TEXTURE.PLAYER_WALK
    PLAYER.celIndex = (PLAYER.celIndex + 1) % 2
  }
  if (!actionState[Action.LEFT] && !actionState[Action.RIGHT]) {
    PLAYER.texture = TEXTURE.PLAYER_IDLE
    PLAYER.celIndex = 0
  }

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
