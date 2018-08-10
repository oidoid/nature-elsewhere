import {Level0} from './assets/levels/level0'
import * as assetsLoader from './assets/asset-loader'
import * as shaderLoader from './graphics/glsl/shader-loader'
import * as renderer from './graphics/renderer'
import {GL, check} from './graphics/gl'
import * as vertexSrc from './graphics/glsl/texture-atlas.vert'
import * as fragmentSrc from './graphics/glsl/texture-atlas.frag'
import * as keyboard from './input/keyboard'
import * as textureAtlas from './assets/textures/texture-atlas'
import * as atlasJSON from './assets/textures/atlas.json'
import {ASSET_URL, TEXTURE} from './assets/textures/texture'
import {Action, ActionState, newActionState} from './input/action'
import {Sprite, SpriteType} from './assets/sprites/sprite'
import {entries, flatten} from './util'
import {VERT_ATTRS, newVert, newInstance} from './graphics/vert'
import {update} from './assets/sprites/sprite-factory'

// The minimum render height and expected minimum render width. The maximum
// render height is 2 * MIN_RENDER_SIZE - 1. There is no minimum or maximum
// render width.
const MIN_CAM_HEIGHT = 128
const actionState: ActionState = newActionState()
let requestAnimationFrameID: number | undefined

const verts = new Int16Array(
  [
    newVert({x: 1, y: 1}),
    newVert({x: 0, y: 1}),
    newVert({x: 1, y: 0}),
    newVert({x: 0, y: 0})
  ].reduce(flatten)
)
let instances = new Int16Array()

// need to make those array changes!
function main(window: Window) {
  const canvas = window.document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing in document.')

  const gl: GL = check(
    canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      antialias: false,
      failIfMajorPerformanceCaveat: true
    })
  )

  // Allow translucent textures to be layered.
  gl.enable(gl.BLEND)
  gl.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)

  const ctx = shaderLoader.load(gl, vertexSrc, fragmentSrc)
  gl.useProgram(ctx.program)

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

  const atlas = textureAtlas.unmarshal(atlasJSON)
  assetsLoader
    .load(ASSET_URL)
    .then(assets => {
      const gfx = renderer.init(gl, ctx, assets, verts)
      instances = new Int16Array(
        Level0.Map.sprites.length * VERT_ATTRS.instance.length
      )
      requestAnimationFrameID = requestAnimationFrame(now =>
        loop(gl, ctx, atlas, assets, now, now, Level0.Map.sprites, gfx)
      )
    })
    .catch(e => {
      console.error(e)
      renderer.deinit(gl, ctx, null, null)
      document.removeEventListener('keyup', onKeyChange)
      document.removeEventListener('keydown', onKeyChange)
    })
}

// render
// ReadOnly<array>
// invalidate: updated ? true : false

function loop(
  gl: GL,
  ctx: shaderLoader.ShaderContext,
  atlas: textureAtlas.TextureAtlas,
  assets: assetsLoader.Assets,
  prev: number,
  next: number,
  sprites: Sprite[],
  gfx: renderer.Gfx
): void {
  requestAnimationFrameID = requestAnimationFrame(now =>
    loop(gl, ctx, atlas, assets, next, now, sprites, gfx)
  )

  // If focus is lost, do not advance more than a second.
  const step = Math.min(1000, next - prev) / 1000

  if (actionState[Action.DEBUG_CONTEXT_LOSS]) {
    const extension = gl.getExtension('WEBGL_lose_context')
    if (extension) {
      if (gl.isContextLost()) {
        console.log('GL restore context.')
        extension.restoreContext()
      } else {
        console.log('GL lose context.')
        extension.loseContext()
      }
    }
  }

  sprites.forEach(sprite => update(atlas, sprite, step))
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

  // Load the images into the texture.
  sprites.forEach((sprite, i) => {
    if (!sprite.invalidated) return

    const texture = atlas.animations[sprite.texture.textureID]
    const coord = texture.cels[sprite.celIndex].bounds
    instances.set(
      newInstance(coord, sprite.scrollPosition, sprite.position, sprite.scale),
      i * VERT_ATTRS.instance.length
    )
  })

  const multiple = Math.ceil(window.innerHeight / MIN_CAM_HEIGHT)
  const ratio = window.innerWidth / window.innerHeight
  // The viewport fills or exceeds the canvas at integer multiples of cam.h.
  const viewport = {
    w: Math.ceil(ratio * multiple * MIN_CAM_HEIGHT),
    h: multiple * MIN_CAM_HEIGHT
  } // px
  const camWidth = Math.ceil(ratio * MIN_CAM_HEIGHT) // px

  renderer.render(
    gl,
    ctx,
    sprites,
    verts,
    instances,
    // Shader pixels are 1:1 with the canvas. No canvas CSS scaling.
    {w: window.innerWidth, h: window.innerHeight},
    {
      x: Math.ceil(-playerUpdates.position.x) + Math.ceil(camWidth / 2),
      y: Math.ceil(MIN_CAM_HEIGHT / 4),
      w: camWidth,
      h: MIN_CAM_HEIGHT
    },
    // The viewport fills or exceeds the canvas at integer multiples of cam.h.
    // Excess is cropped from the lower-right corner.
    viewport,
    gfx
  )
}

function onGLContextLost(event: Event) {
  console.log('GL context lost')
  event.preventDefault()
  if (requestAnimationFrameID !== undefined) {
    cancelAnimationFrame(requestAnimationFrameID)
    requestAnimationFrameID = undefined
  }
}

function onGLContextRestored() {
  console.log('GL context restored')
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
      70,
      sprite.position.y -
        (actionState[Action.UP] ? pps : 0) +
        (actionState[Action.DOWN] ? pps : 0)
    ),
    z: sprite.position.z
  }
  const texture = actionState[Action.UP]
    ? TEXTURE.PLAYER_ASCEND
    : actionState[Action.DOWN]
      ? sprite.position.y < 70
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

main(window)
