import {Atlas} from './images/atlas'
import {FunctionUtil} from './utils/function-util'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import {Recorder} from './inputs/recorder'
import * as Renderer from './graphics/renderer/renderer'
import * as RendererStateMachine from './graphics/renderer/renderer-state-machine'
import {Settings} from './settings/settings'
import * as ShaderLayoutParser from './graphics/shaders/shader-config-parser'
import * as shaderConfig from './graphics/shaders/shader-config.json'
import {TitleLevel} from './levels/title-level'
import {Viewport} from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'

export class Game {
  private clock: number = 0
  private readonly tick: number = 1000 / 60
  private _level: Level
  private readonly _rendererStateMachine: RendererStateMachine.State
  private readonly _recorder: Recorder = new Recorder()
  private readonly _inputRouter: InputRouter
  private _requestWindowSetting: FunctionUtil.Once = FunctionUtil.never
  constructor(
    window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: Atlas.Definition,
    _settings: Settings
  ) {
    this._inputRouter = new InputRouter(window, canvas)
    const shaderLayout = ShaderLayoutParser.parse(shaderConfig)
    this._level = new TitleLevel(shaderLayout, atlas)
    this._rendererStateMachine = RendererStateMachine.make({
      window,
      canvas,
      onFrame: this.onFrame.bind(this),
      newRenderer: () => Renderer.make(canvas, atlasImage, shaderLayout)
    })
    if (_settings.windowMode === WindowModeSetting.FULLSCREEN) {
      this._requestWindowSetting = FunctionUtil.once(() =>
        window.document.documentElement.requestFullscreen().catch(() => {})
      )
    }
  }

  start(): void {
    this.clock = 0
    RendererStateMachine.start(this._rendererStateMachine)
    this._inputRouter.register()
  }

  stop(): void {
    this._inputRouter.deregister()
    RendererStateMachine.stop(this._rendererStateMachine)
  }

  private onFrame(then: number, now: number): void {
    const time = now - then
    const canvasWH = Viewport.canvasWH(window.document)
    const scale = this._level.scale(canvasWH)
    const cam = Viewport.cam(canvasWH, scale)

    this._inputRouter.record(this._recorder, canvasWH, cam, cam)
    this._recorder.update(time)

    const [set] = this._recorder.combo().slice(-1)
    const bits = set && InputSet.bits(set) & ~InputBit.POINT
    this._requestWindowSetting = this._requestWindowSetting(!!bits)

    const loseContext = this._rendererStateMachine.renderer.loseContext
    if (this._recorder.triggered(InputBit.DEBUG_CONTEXT_LOSS) && loseContext) {
      this._inputRouter.reset()
      this._inputRouter.record(this._recorder, canvasWH, cam, cam)
      this._recorder.update(time)

      console.log('Lose renderer context.')
      loseContext.loseContext()
      setTimeout(() => {
        console.log('Restore renderer context.')
        loseContext.restoreContext()
      }, 3 * 1000)
    }

    let update
    for (this.clock += time; this.clock >= this.tick; this.clock -= this.tick) {
      update = this._level.update(this.tick, canvasWH, cam)
      if (!this._level) break
    }

    if (!update) return
    if (update.nextLevel) {
      this._level = update.nextLevel
      Renderer.render(
        this._rendererStateMachine.renderer,
        canvasWH,
        scale,
        cam,
        update
      )
    } else {
      this.stop()
    }
  }
}
