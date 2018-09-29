import * as asepriteParser from './parsers/asepriteParser'
import * as atlas from './entities/atlas'
import * as atlasJSON from './assets/atlas.json'
import * as entity from './entities/entity'
import * as level0 from './levels/level0'
import * as keyboard from './inputs/keyboard'
import * as random from './random'
import * as recorder from './inputs/recorder'
import * as renderer from './graphics/renderer'
import * as store from './entities/store'

type State = {
  readonly atlas: atlas.State
  readonly atlasTexture: HTMLImageElement
  readonly store: store.State
  readonly player: entity.State
  readonly canvas: HTMLCanvasElement
  frameID: number
  renderer: renderer.State
  recorderState: recorder.State
  readonly scale: number
  random: random.State
}

export function newState(
  document: Document,
  atlasTexture: HTMLImageElement
): State {
  const atlas = asepriteParser.parse(atlasJSON)
  const storeState = store.newState()
  const randomState = random.newState(0)
  const level0State = level0.newState(atlas, randomState)
  store.nextSpawnState(storeState, level0State.entities)

  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing.')

  const rendererState = renderer.newState(canvas, atlasTexture)

  return {
    atlas,
    atlasTexture,
    store: storeState,
    player: level0State.player,
    canvas,
    frameID: 0,
    renderer: rendererState,
    recorderState: recorder.newState(),
    scale: 6,
    random: randomState
  }
}

export function nextStartState(state: State, document: Document): State {
  document.addEventListener(
    'visibilitychange',
    _ => (document.hidden ? onPaused(state) : onResumed(state, document))
  )
  state.canvas.addEventListener('webglcontextlost', event =>
    onContextLost(state, event)
  )
  state.canvas.addEventListener('webglcontextrestored', event =>
    onContextRestored(state, document, event)
  )

  document.addEventListener('keydown', event => onKeyChange(state, event))
  document.addEventListener('keyup', event => onKeyChange(state, event))

  if (!document.hidden && !state.renderer.gl.isContextLost()) {
    startLooping(state, document)
  }

  return state
}

function onPaused(state: State): void {
  console.log('Paused.')
  cancelAnimationFrame(state.frameID)

  // Any pending key up events are lost. Clear the state.
  state.recorderState = recorder.newState()
}

function onContextLost(state: State, event: Event): void {
  console.log('Renderer context lost.')
  cancelAnimationFrame(state.frameID)
  event.preventDefault()
}

function onResumed(state: State, document: Document): void {
  console.log('Resumed.')
  if (!state.renderer.gl.isContextLost()) {
    startLooping(state, document)
  }
}

function onContextRestored(
  state: State,
  document: Document,
  event: Event
): void {
  console.log('Renderer context restored.')
  state.renderer = renderer.newState(state.canvas, state.atlasTexture)
  if (!document.hidden) {
    startLooping(state, document)
  }
  event.preventDefault()
}

function onKeyChange(state: State, event: KeyboardEvent): void {
  const key = keyboard.DEFAULT_KEY_MAP[event.key]
  if (key === undefined) return
  const active = event.type === 'keydown'
  state.recorderState = recorder.nextActiveState(
    state.recorderState,
    key,
    active
  )

  // Since looping is paused during context loss, a check is performed whenever
  // a key is pressed.
  checkLoseContext(state)

  event.preventDefault()
}

function onLoop(
  state: State,
  document: Document,
  then: number,
  now: number
): void {
  // Steps are measured in microseconds.
  const step = (now - then) / 1000

  then = now
  state.frameID = requestAnimationFrame(now =>
    onLoop(state, document, then, now)
  )

  store.nextStepState(state.store, step, state.atlas, state.recorderState)
  store.flushUpdatesToMemory(state.atlas, state.store)
  // Pixels rendered by the shader are 1:1 with the canvas. No canvas CSS
  // scaling.
  const canvas = {
    w: document.documentElement ? document.documentElement.clientWidth : 0,
    h: document.documentElement ? document.documentElement.clientHeight : 0
  }
  renderer.render(
    state.renderer,
    canvas,
    state.scale,
    {x: state.player.position.x, y: state.player.position.y + 20},
    state.store.memory,
    state.store.entities.length
  )

  state.recorderState = recorder.nextTriggeredState(state.recorderState)
}

function startLooping(state: State, document: Document): void {
  state.frameID = requestAnimationFrame(now =>
    onLoop(state, document, now, now)
  )
}

function checkLoseContext(state: State) {
  if (
    state.recorderState[recorder.Input.DEBUG_CONTEXT_LOSS].triggered &&
    state.renderer.loseContext
  ) {
    if (state.renderer.gl.isContextLost()) {
      console.log('Restore renderer context.')
      state.renderer.loseContext.restoreContext()
    } else {
      console.log('Lose renderer context.')
      state.renderer.loseContext.loseContext()
    }
  }
}
