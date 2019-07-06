import {Atlas} from './images/atlas'
import {FunctionUtil} from './utils/function-util'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import {Random} from './math/random'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer/renderer'
import {RendererStateMachine} from './graphics/renderer/renderer-state-machine'
import {Settings} from './settings/settings'
import {TitleLevel} from './levels/0-title-level'
import {Viewport} from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'

export class Game {
  private _level: Level
  private readonly _rendererStateMachine: RendererStateMachine
  private readonly _recorder: Recorder = new Recorder()
  private readonly _inputRouter: InputRouter
  private _requestWindowSetting: FunctionUtil.Once = FunctionUtil.never
  constructor(
    window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: Atlas.Definition,
    paletteImage: HTMLImageElement,
    _settings: Settings
  ) {
    this._inputRouter = new InputRouter(window, canvas)
    this._level = new TitleLevel(atlas, this._recorder, new Random(0))
    this._rendererStateMachine = new RendererStateMachine(
      window,
      canvas,
      atlasImage,
      paletteImage,
      this.onAnimationFrame.bind(this),
      this.onPause.bind(this)
    )
    if (_settings.windowMode === WindowModeSetting.FULLSCREEN) {
      this._requestWindowSetting = FunctionUtil.once(() =>
        window.document.documentElement.requestFullscreen().catch(() => {})
      )
    }
  }

  start(): void {
    this._rendererStateMachine.start()
    this._inputRouter.register()
  }

  stop(): void {
    this._inputRouter.deregister()
    this._rendererStateMachine.stop()
  }

  private onPause(): void {
    this._inputRouter.reset()
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

    const [set] = this._recorder.combo().slice(-1)
    const bits = set && InputSet.bits(set) & ~InputBit.POINT
    this._requestWindowSetting = this._requestWindowSetting(!!bits)

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
