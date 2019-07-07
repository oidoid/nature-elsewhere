import {Atlas} from './images/atlas'
import {FunctionUtil} from './utils/function-util'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import {Random} from './math/random'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer/renderer'
import * as RendererStateMachine from './graphics/renderer/renderer-state-machine'
import * as ShaderLayoutParser from './graphics/shaders/shader-config-parser'
import * as shaderConfig from './graphics/shaders/shader-config.json'
import {Settings} from './settings/settings'
import {TitleLevel} from './levels/0-title-level'
import {Viewport} from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'

export class Game {
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
    paletteImage: HTMLImageElement,
    _settings: Settings
  ) {
    this._inputRouter = new InputRouter(window, canvas)
    const shaderLayout = ShaderLayoutParser.parse(shaderConfig)
    this._level = new TitleLevel(
      shaderLayout,
      atlas,
      this._recorder,
      new Random(0)
    )
    this._rendererStateMachine = RendererStateMachine.make({
      window,
      canvas,
      onFrame: this.onAnimationFrame.bind(this),
      newRenderer: () =>
        Renderer.new(shaderLayout, canvas, atlasImage, paletteImage)
    })
    if (_settings.windowMode === WindowModeSetting.FULLSCREEN) {
      this._requestWindowSetting = FunctionUtil.once(() =>
        window.document.documentElement.requestFullscreen().catch(() => {})
      )
    }
  }

  start(): void {
    RendererStateMachine.start(this._rendererStateMachine)
    this._inputRouter.register()
  }

  stop(): void {
    this._inputRouter.deregister()
    RendererStateMachine.stop(this._rendererStateMachine)
  }

  private onAnimationFrame(then: number, now: number): void {
    const milliseconds = now - then
    const canvasWH = Viewport.canvasWH(window.document)
    const scale = this._level.scale(canvasWH)
    const cam = Viewport.cam(canvasWH, scale)

    this._inputRouter.record(this._recorder, canvasWH, cam, cam)
    this._recorder.update(milliseconds)

    const [set] = this._recorder.combo().slice(-1)
    const bits = set && InputSet.bits(set) & ~InputBit.POINT
    this._requestWindowSetting = this._requestWindowSetting(!!bits)

    if (this._recorder.triggered(InputBit.DEBUG_CONTEXT_LOSS)) {
      this._inputRouter.reset()
      this._inputRouter.record(this._recorder, canvasWH, cam, cam)
      this._recorder.update(milliseconds)

      console.log('Lose renderer context.')
      this._rendererStateMachine.renderer.debugLoseContext()
      setTimeout(() => {
        console.log('Restore renderer context.')
        this._rendererStateMachine.renderer.debugRestoreContext()
      }, 3 * 1000)
    }

    const update = this._level.update(then, now, canvasWH, cam)
    if (update.nextLevel) {
      this._level = update.nextLevel
      this._rendererStateMachine.renderer.render(
        canvasWH,
        scale,
        cam,
        update.instances,
        update.length
      )
    } else {
      this.stop()
    }
  }
}
