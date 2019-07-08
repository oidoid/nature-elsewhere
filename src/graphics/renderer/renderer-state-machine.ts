import {State as Renderer} from './renderer'

export interface State {
  readonly window: Window
  readonly canvas: HTMLCanvasElement
  renderer: Renderer
  frameID?: number
  onFrame(then: number, now: number): void
  newRenderer(): Renderer
  onEvent(event: Event): void
}

export function make(start: Omit<State, 'renderer' | 'onEvent'>): State {
  const state = {onEvent: (event: Event) => onEvent(<State>state, event)}
  return Object.assign(state, start, {renderer: start.newRenderer()})
}

export function start(state: State): void {
  register(state, true), loop(state)
}

export function stop(state: State): void {
  if (state.frameID) state.window.cancelAnimationFrame(state.frameID)
  delete state.frameID
  register(state, false)
}

function onEvent(state: State, event: Event): void {
  if (event.type === 'webglcontextrestored')
    state.renderer = state.newRenderer()
  if (!state.frameID) loop(state)
  event.preventDefault()
}

function loop(state: State, then?: number): void {
  state.frameID = state.window.requestAnimationFrame(now => {
    if (state.window.document.hasFocus() && !state.renderer.gl.isContextLost())
      state.onFrame(then || now, now), loop(state, now)
    else delete state.frameID
  })
}

function register(state: State, register: boolean): void {
  const fnc = register ? 'addEventListener' : 'removeEventListener'
  state.canvas[fnc]('webglcontextrestored', state.onEvent)
  state.canvas[fnc]('webglcontextlost', state.onEvent)
  state.window[fnc]('focus', state.onEvent)
}
