import {Renderer} from './renderer'

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │StateMachine                                                         │
 * │window                   ┌──────────────────────────────────────────┐│
 * │canvas                   │onVisibilityChanged                       ││
 * │atlas                    │onWebGLContextRestored                    ││
 * │palette                  │onWebGLContextLost                        ││
 * │onAnimationFrame         │                                ┌────────┐││
 * │onPause                  │┌─────────┐ renderer && visible │Looping │││
 * │╔════════════════╗ start ││Paused   ├────────────────────▶│renderer│││
 * │║Idle            ╟──────▶││renderer?│ !renderer || hidden │frameID │││
 * │║renderer?       ║ stop  │└─────────┘◀────────────────────┴────────┘││
 * │╚════════════════╝◀──────┴──────────────────────────────────────────┘│
 * └─────────────────────────────────────────────────────────────────────┘
 */

interface IdleContext {
  readonly window: Window
  readonly canvas: HTMLCanvasElement
  readonly atlas: HTMLImageElement
  readonly palette: HTMLImageElement
  readonly onAnimationFrame: OnAnimationFrame
  onPause(): void
  /** Undefined when context is lost. */
  readonly renderer?: Renderer
  transition(input: Input): void
}

interface PausedContext extends IdleContext {
  onVisibilityChanged(event: Event): void
  onWebGLContextRestored(event: Event): void
  onWebGLContextLost(event: Event): void
}

interface LoopingContext extends PausedContext {
  readonly renderer: Renderer
  frameID: number
}

type IdleState = ReturnType<typeof newIdleState>
type PausedState = ReturnType<typeof newPausedState>
type LoopingState = ReturnType<typeof enterLoopingState>
type State = IdleState | PausedState | LoopingState

type Input = keyof (IdleState & PausedState & LoopingState)

interface OnAnimationFrame {
  (renderer: Renderer, then: number, now: number): void
}

export class RendererStateMachine {
  private _state: State
  constructor(
    window: Window,
    canvas: HTMLCanvasElement,
    atlas: HTMLImageElement,
    palette: HTMLImageElement,
    onAnimationFrame: OnAnimationFrame,
    onPause: () => void
  ) {
    this._state = newIdleState({
      window,
      canvas,
      atlas,
      palette,
      onAnimationFrame,
      onPause,
      transition: this.transition.bind(this)
    })
  }

  start() {
    this.transition('start')
  }
  stop() {
    this.transition('stop')
  }

  private transition(input: Input): void {
    this._state =
      input in this._state
        ? (<Record<Input, () => State>>this._state)[input]()
        : this._state
  }
}

function newIdleState(context: IdleContext) {
  return {
    start() {
      const pausedContext = newPausedContext(context)
      registerListeners(pausedContext, true)
      return pausedContext.window.document.hidden
        ? newPausedState(pausedContext)
        : enterLoopingState(pausedContext)
    }
  }
}

function newPausedState(context: PausedContext) {
  context.onPause()
  return {
    stop() {
      registerListeners(context, false)
      return newIdleState(context)
    },
    onContextRestored() {
      console.log('WebGL context restored.')
      const rendererContext = {
        ...context,
        renderer: Renderer.new(context.canvas, context.atlas, context.palette)
      }
      return context.window.document.hidden
        ? newPausedState(rendererContext)
        : enterLoopingState(rendererContext)
    },
    onContextLost() {
      console.log('WebGL context lost.')
      return newPausedState({...context, renderer: undefined})
    },
    onVisible() {
      console.log('Document visible.')
      return context.renderer
        ? enterLoopingState(<PausedContext & {renderer: Renderer}>context)
        : this
    },
    onHidden() {
      console.log('Document hidden.')
      return this
    }
  }
}

function enterLoopingState(context: PausedContext & {renderer: Renderer}) {
  let loopingContext: LoopingContext

  function onLoop(then: number, now: number) {
    loopingContext.frameID = context.window.requestAnimationFrame(then =>
      onLoop(now, then)
    )
    context.onAnimationFrame(context.renderer, then, now)
  }

  loopingContext = {
    ...context,
    frameID: context.window.requestAnimationFrame(then => onLoop(then, then))
  }
  return newLoopingState(loopingContext)
}

function newLoopingState(context: LoopingContext) {
  return {
    stop() {
      context.window.cancelAnimationFrame(context.frameID)
      registerListeners(context, false)
      return newIdleState(context)
    },
    onContextLost() {
      console.log('WebGL context lost.')
      context.window.cancelAnimationFrame(context.frameID)
      return newPausedState({...context, renderer: undefined})
    },
    onHidden() {
      console.log('Document hidden.')
      context.window.cancelAnimationFrame(context.frameID)
      return newPausedState(context)
    }
  }
}

function newPausedContext(context: IdleContext) {
  return {
    ...context,
    renderer: context.renderer
      ? context.renderer
      : Renderer.new(context.canvas, context.atlas, context.palette),
    onVisibilityChanged(event: Event) {
      event.preventDefault()
      context.transition(
        context.window.document.hidden ? 'onHidden' : 'onVisible'
      )
    },
    onWebGLContextRestored(event: Event) {
      event.preventDefault()
      context.transition('onContextRestored')
    },
    onWebGLContextLost(event: Event) {
      event.preventDefault()
      context.transition('onContextLost')
    }
  }
}

function registerListeners(context: PausedContext, register: boolean): void {
  const fnc = register ? 'addEventListener' : 'removeEventListener'
  context.window.document[fnc]('visibilitychange', context.onVisibilityChanged)
  context.canvas[fnc]('webglcontextrestored', context.onWebGLContextRestored)
  context.canvas[fnc]('webglcontextlost', context.onWebGLContextLost)
}
