import {Atlas} from './images/atlas'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer'
import {RendererStateMachine} from './graphics/renderer-state-machine'
import {TitleLevel} from './levels/0-title-level'
import {Viewport} from './graphics/viewport'

export class Game {
  private _level: Level
  private readonly _rendererStateMachine: RendererStateMachine
  private readonly _recorder: Recorder = new Recorder()
  private readonly _inputRouter: InputRouter
  constructor(
    window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: Atlas.Definition,
    paletteImage: HTMLImageElement
  ) {
    this._inputRouter = new InputRouter(window, canvas)
    this._level = new TitleLevel(atlas, this._recorder)
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
    this._inputRouter.register()
  }

  stop(): void {
    this._inputRouter.deregister()
    this._rendererStateMachine.stop()
  }

  private onAnimationFrame(
    renderer: Renderer,
    then: number,
    now: number
  ): void {
    const milliseconds = now - then
    const viewport = Viewport.canvas(window)
    const scale = this._level.scale(viewport)
    const cam = Viewport.cam(viewport, scale)

    this._inputRouter.record(this._recorder, viewport, cam, cam)
    this._recorder.update(milliseconds)

    if (this._recorder.triggered(InputBit.DEBUG_CONTEXT_LOSS)) {
      console.log('Lose renderer context.')
      renderer.debugLoseContext()
      setTimeout(() => {
        console.log('Restore renderer context.')
        renderer.debugRestoreContext()
      }, 3 * 1000)
    }

    const update = this._level.update(then, now, viewport, cam)
    if (update.nextLevel) {
      this._level = update.nextLevel
      renderer.render(viewport, scale, cam, update.instances, update.length)
    } else {
      this.stop()
    }
  }
}
