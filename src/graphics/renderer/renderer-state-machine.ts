import {Renderer} from './renderer'

export interface RendererStateMachine {
  readonly window: Window
  readonly canvas: HTMLCanvasElement
  readonly renderer: Renderer
  readonly frameID?: number
  onFrame(time: number): void
  onPause(): void
  newRenderer(): Renderer
  onEvent(ev: Event): void
}

export namespace RendererStateMachine {
  export const make = (
    start: Omit<RendererStateMachine, 'renderer' | 'onEvent'>
  ): RendererStateMachine => {
    const renderer = start.newRenderer()
    const ret = {...start, renderer, onEvent: (ev: Event) => onEvent(ret, ev)}
    return ret
  }

  export const start = (state: RendererStateMachine): void => (
    register(state, true), resume(state)
  )

  export const stop = (state: Mutable<RendererStateMachine>): void => (
    pause(state), register(state, false)
  )
}

const pause = (state: Mutable<RendererStateMachine>): void => {
  if (state.frameID) state.window.cancelAnimationFrame(state.frameID)
  delete state.frameID, state.onPause()
}

const resume = (state: Mutable<RendererStateMachine>): void => {
  const context = !state.renderer.gl.isContextLost()
  if (state.window.document.hasFocus() && context && !state.frameID) loop(state)
}

const onEvent = (state: Mutable<RendererStateMachine>, ev: Event): void => {
  if (ev.type === 'webglcontextrestored')
    (state.renderer = state.newRenderer()), resume(state)
  else if (ev.type === 'focus') resume(state)
  else pause(state)
  ev.preventDefault()
}

const loop = (state: Mutable<RendererStateMachine>, then?: number): void => {
  state.frameID = state.window.requestAnimationFrame(now => {
    state.onFrame(now - (then || now)), loop(state, now)
  })
}

const register = (state: RendererStateMachine, register: boolean): void => {
  const fn = register ? 'addEventListener' : 'removeEventListener'
  state.canvas[fn]('webglcontextrestored', state.onEvent)
  state.canvas[fn]('webglcontextlost', state.onEvent)
  ;['focus', 'blur'].forEach(ev => state.window[fn](ev, state.onEvent))
}
