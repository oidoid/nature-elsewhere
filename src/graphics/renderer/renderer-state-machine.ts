import {Renderer} from './renderer'

export interface RendererStateMachine {
  readonly window: Window
  readonly canvas: HTMLCanvasElement
  renderer: Renderer
  frameID?: number
  onFrame(then: number, now: number): void
  newRenderer(): Renderer
  onEvent(event: Event): void
}

export namespace RendererStateMachine {
  export function make(
    start: Omit<RendererStateMachine, 'renderer' | 'onEvent'>
  ): RendererStateMachine {
    const state = {
      onEvent: (event: Event) => onEvent(<RendererStateMachine>state, event)
    }
    return Object.assign(state, start, {renderer: start.newRenderer()})
  }

  export function start(state: RendererStateMachine): void {
    register(state, true), loop(state)
  }

  export function stop(state: RendererStateMachine): void {
    if (state.frameID) state.window.cancelAnimationFrame(state.frameID)
    delete state.frameID
    register(state, false)
  }
}

function onEvent(state: RendererStateMachine, event: Event): void {
  if (event.type === 'webglcontextrestored')
    state.renderer = state.newRenderer()
  if (!state.frameID) loop(state)
  event.preventDefault()
}

function loop(state: RendererStateMachine, then?: number): void {
  state.frameID = state.window.requestAnimationFrame(now => {
    if (state.window.document.hasFocus() && !state.renderer.gl.isContextLost())
      state.onFrame(then || now, now), loop(state, now)
    else delete state.frameID
  })
}

function register(state: RendererStateMachine, register: boolean): void {
  const fnc = register ? 'addEventListener' : 'removeEventListener'
  state.canvas[fnc]('webglcontextrestored', state.onEvent)
  state.canvas[fnc]('webglcontextlost', state.onEvent)
  state.window[fnc]('focus', state.onEvent)
}
