import {AtlasDefinition} from './images/atlas-definition'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer'
import {
  newRendererStateMachine,
  RendererStateMachine
} from './graphics/renderer-state-machine'
import {Title} from './levels/00-title'
import {InputEventListener} from './inputs/input-event-listener'
import {InputMask} from './inputs/input-mask'

export class Game {
  private _level: Level
  private readonly rendererStateMachine: RendererStateMachine
  private readonly _recorder: Recorder = new Recorder()
  private readonly _inputEventListener: InputEventListener
  constructor(
    private readonly _window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: AtlasDefinition,
    palettesImage: HTMLImageElement
  ) {
    this._inputEventListener = new InputEventListener(
      _window,
      canvas,
      this._recorder
    )
    this._level = new Title(atlas, this._recorder)
    this.rendererStateMachine = newRendererStateMachine(
      _window,
      canvas,
      atlasImage,
      palettesImage,
      this.onAnimationFrame.bind(this)
    )
  }

  start(): void {
    this.rendererStateMachine.start()
    this._inputEventListener.register()
  }

  stop(): void {
    this._inputEventListener.deregister()
    this.rendererStateMachine.stop()
  }

  private onAnimationFrame(
    renderer: Renderer,
    then: number,
    now: number
  ): void {
    const milliseconds = now - then
    this.processInput(renderer, milliseconds)

    const scale = this._level.scale()
    const camRect = cam(this._window, scale)
    const {nextLevel, instances: dataView, length} = this._level.update(
      then,
      now,
      camRect
    )
    this._level = nextLevel

    renderer.render(canvasSize(this._window), scale, camRect, dataView, length)

    // Clear point which has no off event.
    this._recorder.set(InputMask.POINT, false)
  }

  private processInput(renderer: Renderer, milliseconds: number): void {
    // Verify input is pumped here or by event listener.
    this._recorder.write()
    this._recorder.read(milliseconds)

    if (this._recorder.debugContextLoss(true)) {
      console.log('Lose renderer context.') // eslint-disable-line no-console
      renderer.debugLoseContext()
      setTimeout(() => {
        console.log('Restore renderer context.') // eslint-disable-line no-console
        renderer.debugRestoreContext()
      }, 3 * 1000)
    }
  }
}

function canvasSize(window: Window): WH {
  const {clientWidth, clientHeight} = window.document.documentElement
  return {w: clientWidth, h: clientHeight}
}

function cam(window: Window, scale: number): Rect {
  const {w, h} = canvasSize(window)
  return {x: 0, y: 0, w: Math.ceil(w / scale), h: Math.ceil(h / scale)}
}
