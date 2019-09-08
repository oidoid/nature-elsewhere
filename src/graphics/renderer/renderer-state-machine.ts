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
type t = RendererStateMachine

export namespace RendererStateMachine {
  export const make = (start: Omit<t, 'renderer' | 'onEvent'>): t => {
    const renderer = start.newRenderer()
    const ret = {...start, renderer, onEvent: (ev: Event) => onEvent(ret, ev)}
    return ret
  }

  export const start = (state: t): void => (
    register(state, true), resume(state)
  )

  export const stop = (state: Mutable<t>): void => (
    pause(state), register(state, false)
  )
}

const pause = (state: Mutable<t>): void => {
  if (state.frameID) state.window.cancelAnimationFrame(state.frameID)
  delete state.frameID, state.onPause()
}

const resume = (state: Mutable<t>): void => {
  const context = !state.renderer.gl.isContextLost()
  if (state.window.document.hasFocus() && context && !state.frameID) loop(state)
}

const onEvent = (state: Mutable<t>, ev: Event): void => {
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

const register = (state: t, register: boolean): void => {
  const fn = register ? 'addEventListener' : 'removeEventListener'
  state.canvas[fn]('webglcontextrestored', state.onEvent)
  state.canvas[fn]('webglcontextlost', state.onEvent)
  ;['focus', 'blur'].forEach(ev => state.window[fn](ev, state.onEvent))
}
