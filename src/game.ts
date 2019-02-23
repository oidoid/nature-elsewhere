import * as screen from './graphics/screen'
import {AtlasDefinition} from './images/atlas-definition'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer'
import {RendererStateMachine} from './graphics/renderer-state-machine'
import {Title} from './levels/00-title'
import {InputEventListener} from './inputs/input-event-listener'
import {InputMask} from './inputs/input-mask'

export class Game {
  private _level: Level
  private readonly _rendererStateMachine: RendererStateMachine
  private readonly _recorder: Recorder = new Recorder()
  private readonly _inputEventListener: InputEventListener
  constructor(
    window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: AtlasDefinition,
    paletteImage: HTMLImageElement
  ) {
    this._inputEventListener = new InputEventListener(
      window,
      canvas,
      this._recorder
    )
    this._level = new Title(atlas, this._recorder)
    this._rendererStateMachine = new RendererStateMachine(
      window,
      canvas,
      atlasImage,
      paletteImage,
      this.onAnimationFrame.bind(this)
    )
  }

  start(): void {
    this._rendererStateMachine.start()
    this._inputEventListener.register()
  }

  stop(): void {
    this._inputEventListener.deregister()
    this._rendererStateMachine.stop()
  }

  private onAnimationFrame(
    renderer: Renderer,
    then: number,
    now: number
  ): void {
    const milliseconds = now - then
    this.processInput(renderer, milliseconds)

    const canvas = screen.canvas(window)
    const scale = this._level.scale(canvas)
    const cam = screen.cam(canvas, scale)
    const {nextLevel, instances: dataView, length} = this._level.update(
      then,
      now,
      cam
    )
    if (nextLevel) {
      this._level = nextLevel

      renderer.render(canvas, scale, cam, dataView, length)

      // Clear point which has no off event.
      this._recorder.set(InputMask.POINT, false)
    } else {
      this.stop()
    }
  }

  private processInput(renderer: Renderer, milliseconds: number): void {
    // Verify input is pumped here or by event listener.
    this._recorder.write()
    this._recorder.read(milliseconds)

    if (this._recorder.debugContextLoss(true)) {
      console.log('Lose renderer context.')
      renderer.debugLoseContext()
      setTimeout(() => {
        console.log('Restore renderer context.')
        renderer.debugRestoreContext()
      }, 3 * 1000)
    }
  }
}
