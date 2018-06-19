import {Level0, PLAYER} from './assets/levels/level0'
import * as assetsLoader from './assets/asset-loader'
import * as shaderLoader from './graphics/glsl/shader-loader'
import * as graphics from './graphics/graphics'
import {check, GL} from './graphics/gl'
import * as vertexSrc from './graphics/glsl/main.vert'
import * as fragmentSrc from './graphics/glsl/main.frag'
import * as keyboard from './input/keyboard'
import * as Aseprite from './assets/textures/aseprite'
import * as textureAtlas from './assets/textures/texture-atlas'
import * as atlasJSON from './assets/textures/atlas.json'
import {ASSET_URL, TEXTURE} from './assets/textures/texture'
import {Action, ActionState, newActionState} from './input/action'

// The minimum render height and expected minimum render width. The maximum
// render height is 2 * MIN_RENDER_SIZE - 1. There is no minimum or maximum
// render width.
const MIN_RENDER_HEIGHT = 128
const actionState: ActionState = newActionState()

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
    .catch(() => {
      document.removeEventListener('keyup', onKeyChange)
      document.removeEventListener('keydown', onKeyChange)
    })
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

  // If focus is lost, do not advance more than a second.
  const step = Math.min(1000, now - timestamp) / 1000

  // todo: add pixel per second doc.
  const pps = (actionState[Action.RUN] ? 48 : 16) * step
  if (actionState[Action.LEFT]) {
    PLAYER.flip.x = true
    PLAYER.position.x -= pps
    PLAYER.texture = actionState[Action.RUN]
      ? TEXTURE.PLAYER_RUN
      : TEXTURE.PLAYER_WALK
    PLAYER.celIndex = Math.abs(Math.round(PLAYER.position.x)) % 2
  }
  if (actionState[Action.RIGHT]) {
    PLAYER.flip.x = false
    PLAYER.position.x += pps
    PLAYER.texture = actionState[Action.RUN]
      ? TEXTURE.PLAYER_RUN
      : TEXTURE.PLAYER_WALK
    PLAYER.celIndex = Math.abs(Math.round(PLAYER.position.x)) % 2
  }
  if (actionState[Action.UP]) {
    PLAYER.position.y -= pps
    PLAYER.texture = TEXTURE.PLAYER_ASCEND
    PLAYER.celIndex = 0
  }
  if (actionState[Action.DOWN]) {
    PLAYER.position.y += pps
    PLAYER.texture = TEXTURE.PLAYER_DESCEND
    PLAYER.celIndex = 0
  }
  if (!actionState[Action.LEFT] && !actionState[Action.RIGHT]) {
    PLAYER.texture = TEXTURE.PLAYER_IDLE
    PLAYER.celIndex = 0
  }

  PLAYER.position.x = Math.max(0, PLAYER.position.x)

  const renderWidth = gl.canvas.width
  const renderHeight = gl.canvas.height
  const cameraLocation = ctx.location('uViewport.camera')
  gl.uniform2f(
    cameraLocation,
    -PLAYER.position.x + renderWidth / 2,
    renderHeight / 4
  )

  for (const sprite of Level0.Map.sprites) {
    sprite.position.x += step * sprite.speed.x
    sprite.position.y += step * sprite.speed.y

    sprite.scrollPosition.x += step * sprite.scroll.x
    sprite.scrollPosition.y += step * sprite.scroll.y
  }

  graphics.render(
    gl,
    ctx,
    atlas,
    assets,
    Level0.Map.sprites,
    Level0.Map.backgroundColor,
    MIN_RENDER_HEIGHT
  )
}

main(window)
