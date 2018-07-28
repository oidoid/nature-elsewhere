import {Level0} from './assets/levels/level0'
import * as assetsLoader from './assets/asset-loader'
import * as shaderLoader from './graphics/glsl/shader-loader'
import * as graphics from './graphics/graphics'
import {GL, check} from './graphics/gl'
import * as vertexSrc from './graphics/glsl/main.vert'
import * as fragmentSrc from './graphics/glsl/main.frag'
import * as keyboard from './input/keyboard'
import * as Aseprite from './assets/textures/aseprite'
import * as textureAtlas from './assets/textures/texture-atlas'
import * as atlasJSON from './assets/textures/atlas.json'
import {ASSET_URL, TEXTURE} from './assets/textures/texture'
import {Action, ActionState, newActionState} from './input/action'
import {Sprite, SpriteType} from './assets/sprites/sprite'
import {entries} from './util'
import {newVertex} from './graphics/vertex'
import {WH, Rect, XYZ, XY} from './types/geo'

// The minimum render height and expected minimum render width. The maximum
// render height is 2 * MIN_RENDER_SIZE - 1. There is no minimum or maximum
// render width.
const MIN_RENDER_HEIGHT = 128
const actionState: ActionState = newActionState()
let requestAnimationFrameID: number | undefined

const textureUV = [
  {x: 0, y: 0},
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: 0, y: 1},
  {x: 1, y: 0},
  {x: 1, y: 1}
]
let verts = new Int16Array()

// need to make those array changes!
function main(window: Window) {
  const canvas = window.document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing in document.')

  const gl: GL = check(
    canvas.getContext('webgl', {
      alpha: false,
      depth: false,
      antialias: false,
      failIfMajorPerformanceCaveat: true
    })
  )

  // Allow translucent textures to be layered.
  gl.enable(gl.BLEND)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const ctx = shaderLoader.load(gl, vertexSrc, fragmentSrc)
  gl.useProgram(ctx.program)

  // Debug.
  Object.assign(window, {gl, ctx})

  const onKeyChange = (event: KeyboardEvent) => {
    const action = keyboard.DEFAULT_KEY_MAP[event.key]
    const active = event.type === 'keydown'
    actionState[action] = active
  }
  document.addEventListener('keydown', onKeyChange)
  document.addEventListener('keyup', onKeyChange)
  canvas.addEventListener('webglcontextlost', onGLContextLost)
  canvas.addEventListener('webglcontextrestored', onGLContextRestored)

  // if focus loss detected, reset the inputs and pause

  const atlas = textureAtlas.unmarshal(<Aseprite.File>atlasJSON)
  assetsLoader
    .load(ASSET_URL)
    .then(assets => {
      graphics.init(gl, ctx, assets)
      verts = new Int16Array(Level0.Map.sprites.length * 15 * 6)
      requestAnimationFrameID = requestAnimationFrame(now =>
        loop(gl, ctx, atlas, assets, now, now, Level0.Map.sprites)
      )
    })
    .catch(() => {
      graphics.deinit(gl, ctx, null, null)
      document.removeEventListener('keyup', onKeyChange)
      document.removeEventListener('keydown', onKeyChange)
    })
}

// render
// ReadOnly<array>
// invalidate: updated ? true : false
// eslint-config-rndmem without style?

function loop(
  gl: GL,
  ctx: shaderLoader.ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: assetsLoader.Assets,
  prev: number,
  next: number,
  sprites: Sprite[]
): void {
  requestAnimationFrameID = requestAnimationFrame(now =>
    loop(gl, ctx, atlas, assets, next, now, sprites)
  )

  // If focus is lost, do not advance more than a second.
  const step = Math.min(1000, next - prev) / 1000

  if (actionState[Action.DEBUG_CONTEXT_LOSS]) {
    const extension = gl.getExtension('WEBGL_lose_context')
    if (extension) {
      if (gl.isContextLost()) {
        console.log('GL restore context.') // eslint-disable-line no-console
        extension.restoreContext()
      } else {
        console.log('GL lose context.') // eslint-disable-line no-console
        extension.loseContext()
      }
    }
  }

  sprites = sprites.map(sprite => update(atlas, sprite, step))
  const playerIndex = sprites.findIndex(
    sprite => sprite.type === SpriteType.PLAYER
  )
  const playerUpdates = updatePlayer(atlas, sprites[playerIndex], step)
  const playerUpdated = entries(playerUpdates).some(
    ([key, val]) => val !== sprites[playerIndex][key]
  )
  const player = {
    ...sprites[playerIndex],
    ...playerUpdates,
    invalidated: playerUpdated
  }
  sprites[playerIndex] = player

  let i = 0
  // Load the images into the texture.
  for (const sprite of sprites) {
    if (!sprite.invalidated) {
      i += 15 * 6
      continue
    }

    const tex = atlas.animations[sprite.texture.textureID]

    for (const vert of rect(
      atlas.size,
      tex.cels[sprite.celIndex].bounds,
      textureUV,
      sprite.position,
      sprite.scrollPosition,
      sprite.scale
    )) {
      verts[i] = vert
      ++i
    }
  }

  graphics.render(
    gl,
    ctx,
    sprites,
    verts,
    {
      x:
        Math.trunc(-playerUpdates.position.x) + Math.trunc(gl.canvas.width / 2),
      y: Math.trunc(gl.canvas.height / 4)
    },
    {w: window.innerWidth, h: window.innerHeight},
    MIN_RENDER_HEIGHT
  )
}

function rect(
  atlasSize: WH,
  textureRect: Rect,
  textureUV: XY[],
  {x, y, z}: XYZ,
  scroll: XY,
  scale: XY
): number[] {
  const x1 = x + textureRect.w
  const y1 = y + textureRect.h
  const v = newVertex.bind(undefined, atlasSize, textureRect, scroll, scale)
  return (<number[]>[]).concat(
    v(textureUV[0], x, y, z),
    v(textureUV[1], x1, y, z),
    v(textureUV[2], x, y1, z),
    v(textureUV[3], x, y1, z),
    v(textureUV[4], x1, y, z),
    v(textureUV[5], x1, y1, z)
  )
}

function onGLContextLost(event: Event) {
  console.log('GL context lost') // eslint-disable-line no-console
  event.preventDefault()
  if (requestAnimationFrameID !== undefined) {
    cancelAnimationFrame(requestAnimationFrameID)
    requestAnimationFrameID = undefined
  }
}

function onGLContextRestored() {
  console.log('GL context restored') // eslint-disable-line no-console
  // init();
}

function updatePlayer(
  atlas: textureAtlas.TextureAtlas,
  sprite: Sprite,
  step: number
) {
  // todo: add pixel per second doc.
  const pps = (actionState[Action.RUN] ? 48 : 16) * step

  // sprite.texture.

  const scale = {
    x: actionState[Action.LEFT]
      ? -1
      : actionState[Action.RIGHT]
        ? 1
        : sprite.scale.x,
    y: sprite.scale.y
  }
  const position = {
    x: Math.max(
      0,
      sprite.position.x -
        (actionState[Action.LEFT] ? pps : 0) +
        (actionState[Action.RIGHT] ? pps : 0)
    ),
    y: Math.min(
      60,
      sprite.position.y -
        (actionState[Action.UP] ? pps : 0) +
        (actionState[Action.DOWN] ? pps : 0)
    ),
    z: sprite.position.z
  }
  const texture = actionState[Action.UP]
    ? TEXTURE.PLAYER_ASCEND
    : actionState[Action.DOWN]
      ? sprite.position.y < 60
        ? TEXTURE.PLAYER_DESCEND
        : TEXTURE.PLAYER_CROUCH
      : actionState[Action.LEFT] || actionState[Action.RIGHT]
        ? actionState[Action.RUN]
          ? TEXTURE.PLAYER_RUN
          : TEXTURE.PLAYER_WALK
        : TEXTURE.PLAYER_IDLE

  const celIndex =
    Math.abs(Math.round(position.x / (actionState[Action.RUN] ? 6 : 2))) %
    atlas.animations[texture.textureID].cels.length

  return {scale, position, texture, celIndex}
}

function update(
  _atlas: textureAtlas.TextureAtlas,
  sprite: Sprite,
  step: number
): Sprite {
  if (!isSpriteUpdating(sprite, step)) return sprite
  return {
    ...sprite,
    position: {
      x: sprite.position.x + step * sprite.speed.x,
      y: sprite.position.y + step * sprite.speed.y,
      z: sprite.position.z
    },
    scrollPosition: {
      x: sprite.scrollPosition.x + step * sprite.scroll.x,
      y: sprite.scrollPosition.y + step * sprite.scroll.y
    },
    invalidated: true
  }
}

function isSpriteUpdating({speed, scroll}: Sprite, step: number): boolean {
  const moving = speed.x || speed.y
  const scrolling = scroll.x || scroll.y
  return !!(step && (moving || scrolling))
}

main(window)
