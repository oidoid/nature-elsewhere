import {Level0} from './assets/levels/level0'
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
import {Sprite, SpriteType} from './assets/sprites/sprite'

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
    .then(assets =>
      loop(gl, ctx, atlas, assets, Date.now(), Level0.Map.sprites)
    )
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
  timestamp: number,
  sprites: Sprite[]
): void {
  const now = Date.now()
  window.requestAnimationFrame(() => loop(gl, ctx, atlas, assets, now, sprites))

  // If focus is lost, do not advance more than a second.
  const step = Math.min(1000, now - timestamp) / 1000

  sprites = sprites.map(sprite => stepSprite(sprite, step))
  const playerIndex = sprites.findIndex(
    sprite => sprite.type === SpriteType.PLAYER
  )
  const playerUpdates = stepPlayer(atlas, sprites[playerIndex], step)
  sprites[playerIndex] = {...sprites[playerIndex], ...playerUpdates}

  const renderWidth = gl.canvas.width
  const renderHeight = gl.canvas.height
  const cameraLocation = ctx.location('uViewport.camera')
  gl.uniform2f(
    cameraLocation,
    -playerUpdates.position.x + renderWidth / 2,
    renderHeight / 4
  )

  graphics.render(gl, ctx, atlas, assets, sprites, MIN_RENDER_HEIGHT)
}

function stepPlayer(
  atlas: textureAtlas.TextureAtlas,
  player: Sprite,
  step: number
) {
  // todo: add pixel per second doc.
  const pps = (actionState[Action.RUN] ? 48 : 16) * step

  const scale = {
    x: actionState[Action.LEFT]
      ? -1
      : actionState[Action.RIGHT]
        ? 1
        : player.scale.x,
    y: player.scale.y
  }
  const position = {
    x: Math.max(
      0,
      player.position.x -
        (actionState[Action.LEFT] ? pps : 0) +
        (actionState[Action.RIGHT] ? pps : 0)
    ),
    y:
      player.position.y -
      (actionState[Action.UP] ? pps : 0) +
      (actionState[Action.DOWN] ? pps : 0)
  }
  const texture = actionState[Action.UP]
    ? TEXTURE.PLAYER_ASCEND
    : actionState[Action.DOWN]
      ? TEXTURE.PLAYER_DESCEND
      : actionState[Action.LEFT] || actionState[Action.RIGHT]
        ? actionState[Action.RUN]
          ? TEXTURE.PLAYER_RUN
          : TEXTURE.PLAYER_WALK
        : TEXTURE.PLAYER_IDLE

  const celIndex =
    Math.abs(Math.round(position.x)) %
    atlas.animations[texture.textureID].cels.length

  return {scale, position, texture, celIndex}
}

function stepSprite(sprite: Sprite, step: number): Sprite {
  return {
    ...sprite,
    position: {
      x: sprite.position.x + step * sprite.speed.x,
      y: sprite.position.y + step * sprite.speed.y
    },
    scrollPosition: {
      x: sprite.scrollPosition.x + step * sprite.scroll.x,
      y: sprite.scrollPosition.y + step * sprite.scroll.y
    }
  }
}

main(window)
