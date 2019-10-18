import {Renderer} from './Renderer'

export interface RendererStateMachine {
  readonly window: Window
  readonly canvas: HTMLCanvasElement
  renderer: Renderer
  frameID?: number
  onFrame(time: number): void
  onPause(): void
  newRenderer(): Renderer
  onEvent(event: Event): void
}

export namespace RendererStateMachine {
  export function make(
    start: Omit<RendererStateMachine, 'renderer' | 'onEvent'>
  ): RendererStateMachine {
    const renderer = start.newRenderer()
    const machine = {
      ...start,
      renderer,
      onEvent: (event: Event) => onEvent(machine, event)
    }
    return machine
  }

  export function start(machine: RendererStateMachine): void {
    register(machine, true), resume(machine)
  }

  export function stop(machine: RendererStateMachine): void {
    pause(machine), register(machine, false)
  }
}

function pause(machine: RendererStateMachine): void {
  if (machine.frameID) machine.window.cancelAnimationFrame(machine.frameID)
  ;(machine.frameID = undefined), machine.onPause()
}

function resume(machine: RendererStateMachine): void {
  const context = !machine.renderer.gl.isContextLost()
  if (machine.window.document.hasFocus() && context && !machine.frameID)
    loop(machine)
}

function onEvent(machine: RendererStateMachine, event: Event): void {
  if (event.type === 'webglcontextrestored')
    (machine.renderer = machine.newRenderer()), resume(machine)
  else if (event.type === 'focus') resume(machine)
  else pause(machine)
  event.preventDefault()
}

function loop(machine: RendererStateMachine, then?: number): void {
  machine.frameID = machine.window.requestAnimationFrame(now => {
    // Duration can be great when frame is held for debugging. Limit it to one
    // second.
    const time = Math.min(now - (then ?? now), 1000)
    machine.onFrame(time)
    loop(machine, now)
  })
}

function register(machine: RendererStateMachine, register: boolean): void {
  const fn = register ? 'addEventListener' : 'removeEventListener'
  machine.canvas[fn]('webglcontextrestored', machine.onEvent)
  machine.canvas[fn]('webglcontextlost', machine.onEvent)
  for (const event of ['focus', 'blur'])
    machine.window[fn](event, machine.onEvent)
}
