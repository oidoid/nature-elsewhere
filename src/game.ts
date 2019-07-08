import * as atlasJSON from './assets/atlas.json'
import {AsepriteParser} from './parsers/aseprite-parser'
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
import {ImageLoader} from './loaders/image-loader'

export class Game {
  static load(): Promise<{
    atlas: Atlas.Definition
    atlasImage: HTMLImageElement
    shaderLayout: ShaderLayout
  }> {
    return ImageLoader.load('assets/images/atlas.png').then(atlasImage => {
      const atlas = AsepriteParser.parse(atlasJSON)
      const shaderLayout = ShaderLayoutParser.parse(shaderConfig)
      return {atlas, atlasImage, shaderLayout}
    })
  }

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
    shaderLayout: ShaderLayout,
    private readonly _settings: Settings
  ) {
    this._inputRouter = new InputRouter(window, canvas)
    this._level = new TitleLevel(shaderLayout, atlas)
    this._rendererStateMachine = RendererStateMachine.make({
      window,
      canvas,
      onFrame: this.onFrame.bind(this),
      newRenderer: () => Renderer.make(canvas, atlasImage, shaderLayout)
    })
  }

  start(): void {
    if (this._settings.windowMode === WindowModeSetting.FULLSCREEN) {
      this._requestWindowSetting = FunctionUtil.once(() =>
        window.document.documentElement.requestFullscreen().catch(() => {})
      )
    }

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

    const renderer = this._rendererStateMachine.renderer
    const loseContext = renderer.loseContext
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
      if (!update.nextLevel) break
    }

    if (!update) return
    if (update.nextLevel) {
      this._level = update.nextLevel
      Renderer.render(renderer, canvasWH, scale, cam, update)
    } else {
      this.stop()
    }
  }
}
