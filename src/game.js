import * as asepriteParser from './parsers/asepriteParser.js'
import * as atlas from './entities/atlas.js'
import * as atlasJSON from './assets/atlas.js'
import * as entity from './entities/entity.js'
import * as level0 from './assets/level0.js'
import * as keyboard from './inputs/keyboard.js'
import * as recorder from './inputs/recorder.js'
import * as renderer from './graphics/renderer.js'
import * as store from './entities/store.js'
import Random from './Random.js'

/** @typedef {{
 *   atlas: atlas.State
 *   atlasImage: HTMLImageElement
 *   store: store.State
 *   player: entity.State
 *   canvas: HTMLCanvasElement
 *   frameID: number
 *   renderer: renderer.Renderer
 *   recorder: recorder.Recorder
 *   readonly scale: number
 *   readonly random: Random
 * }} State
 */

/**
 *
 * @arg {Document} document
 * @arg {HTMLImageElement} atlasImage
 * @return {State}
 */
export function newState(document, atlasImage) {
  const atlas = asepriteParser.parse(atlasJSON.default)
  const storeState = store.newState()
  const randomState = new Random(0)
  const level0State = level0.newState(atlas, randomState)
  store.nextSpawnState(storeState, level0State.entities)

  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing.')

  const rendererState = renderer.init(canvas, atlasImage)

  return {
    atlas,
    atlasImage,
    store: storeState,
    player: level0State.player,
    canvas,
    frameID: 0,
    renderer: rendererState,
    recorder: new recorder.WriteState(),
    scale: 6,
    random: randomState
  }
}

/**
 * @arg {State} state
 * @arg {Document} document
 * @return {State}
 */
export function nextStartState(state, document) {
  document.addEventListener(
    'visibilitychange',
    _ => (document.hidden ? onPaused(state) : onResumed(state, document))
  )
  state.canvas.addEventListener('webglcontextlost', event =>
    onContextLost(event)
  )
  state.canvas.addEventListener('webglcontextrestored', event =>
    onContextRestored(state, event)
  )

  document.addEventListener('keydown', event => onKeyChange(state, event))
  document.addEventListener('keyup', event => onKeyChange(state, event))

  if (!document.hidden) {
    startLooping(state, document)
  }

  return state
}

/**
 * @arg {State} state
 * @return {void}
 */
function onPaused(state) {
  console.log('Paused.')
  cancelAnimationFrame(state.frameID)

  // Any pending key up events are lost. Clear the state.
  state.recorder = new recorder.WriteState()
}

/**
 * @arg {Event} event
 * @return {void}
 */
function onContextLost(event) {
  console.log('Renderer context lost.')
  event.preventDefault()
}

/**
 * @arg {State} state
 * @arg {Document} document
 * @return {void}
 */
function onResumed(state, document) {
  console.log('Resumed.')
  startLooping(state, document)
}

/**
 * @arg {State} state
 * @arg {Event} event
 * @return {void}
 */
function onContextRestored(state, event) {
  console.log('Renderer context restored.')
  state.renderer = renderer.init(state.canvas, state.atlasImage)
  event.preventDefault()
}

/**
 * @arg {State} state
 * @arg {KeyboardEvent} event
 * @return {void}
 */
function onKeyChange(state, event) {
  const key = keyboard.defaultKeyMap[event.key]
  if (key === undefined) return
  const active = event.type === 'keydown'
  if (state.recorder instanceof recorder.ReadState) {
    state.recorder = state.recorder.write()
  }
  state.recorder = state.recorder.set(key, active)

  event.preventDefault()
}

/**
 * @arg {State} state
 * @arg {Document} document
 * @arg {number} then
 * @arg {number} now
 * @return {void}
 */
function onLoop(state, document, then, now) {
  // Steps are measured in milliseconds.
  const step = now - then

  then = now
  state.frameID = requestAnimationFrame(now =>
    onLoop(state, document, then, now)
  )

  if (state.recorder instanceof recorder.ReadState) {
    // Input not pumped by event listener.
    state.recorder = state.recorder.write()
  }
  state.recorder = state.recorder.read(step)

  if (state.recorder.debugContextLoss(true)) {
    if (state.renderer.isContextLost()) {
      console.log('Restore renderer context.')
      state.renderer.debugRestoreContext()
    } else {
      console.log('Lose renderer context.')
      state.renderer.debugLoseContext()
    }
  }

  store.nextStepState(state.store, step, state.atlas, state.recorder)
  store.flushUpdatesToMemory(state.store)
  // Pixels rendered by the shader are 1:1 with the canvas. No canvas CSS
  // scaling.
  const canvas = {
    w: document.documentElement ? document.documentElement.clientWidth : 0,
    h: document.documentElement ? document.documentElement.clientHeight : 0
  }
  state.renderer.render(
    canvas,
    state.scale,
    {x: state.player._position.x, y: state.player._position.y + 20},
    state.store.memory,
    state.store.entities.length
  )
}

/**
 * @arg {State} state
 * @arg {Document} document
 * @return {void}
 */
function startLooping(state, document) {
  state.frameID = requestAnimationFrame(now =>
    onLoop(state, document, now, now)
  )
}
