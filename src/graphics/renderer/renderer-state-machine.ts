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

  export const start = (val: t): void => (register(val, true), resume(val))

  export const stop = (val: Writable<t>): void => (
    pause(val), register(val, false)
  )
}

const pause = (val: Writable<t>): void => {
  if (val.frameID) val.window.cancelAnimationFrame(val.frameID)
  ;(val.frameID = undefined), val.onPause()
}

const resume = (val: Writable<t>): void => {
  const context = !val.renderer.gl.isContextLost()
  if (val.window.document.hasFocus() && context && !val.frameID) loop(val)
}

const onEvent = (val: Writable<t>, ev: Event): void => {
  if (ev.type === 'webglcontextrestored')
    (val.renderer = val.newRenderer()), resume(val)
  else if (ev.type === 'focus') resume(val)
  else pause(val)
  ev.preventDefault()
}

const loop = (val: Writable<RendererStateMachine>, then?: number): void => {
  val.frameID = val.window.requestAnimationFrame(now => {
    val.onFrame(now - (then || now)), loop(val, now)
  })
}

const register = (val: t, register: boolean): void => {
  const fn = register ? 'addEventListener' : 'removeEventListener'
  val.canvas[fn]('webglcontextrestored', val.onEvent)
  val.canvas[fn]('webglcontextlost', val.onEvent)
  ;['focus', 'blur'].forEach(ev => val.window[fn](ev, val.onEvent))
}
