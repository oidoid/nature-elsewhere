import * as atlasJSON from './assets/atlas.json'
import {AsepriteParser} from './parsers/aseprite-parser'
import {Atlas} from './images/atlas'
import {FunctionUtil} from './utils/function-util'
import {ImageLoader} from './loaders/image-loader'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import {Recorder} from './inputs/recorder'
import * as Renderer from './graphics/renderer/renderer'
import * as RendererStateMachine from './graphics/renderer/renderer-state-machine'
import {Settings} from './settings/settings'
import * as shaderConfig from './graphics/shaders/shader-config.json'
import * as ShaderConfigParser from './graphics/shaders/shader-config-parser'
import {TitleLevel} from './levels/title-level'
import {Viewport} from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'

export class Game {
  static load(): Promise<{
    atlas: Atlas.Definition
    atlasImage: HTMLImageElement
    shaderLayout: ShaderLayout
  }> {
    return ImageLoader.load('assets/atlas.png').then(atlasImage => {
      const atlas = AsepriteParser.parse(atlasJSON)
      const shaderLayout = ShaderConfigParser.parse(shaderConfig)
      return {atlas, atlasImage, shaderLayout}
    })
  }

  private duration: number = 0
  private readonly tick: number = 1000 / 60
  private level: Level
  private readonly rendererStateMachine: RendererStateMachine.State
  private readonly recorder: Recorder = new Recorder()
  private readonly inputRouter: InputRouter
  private requestWindowSetting: FunctionUtil.Once = FunctionUtil.never
  constructor(
    window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: Atlas.Definition,
    shaderLayout: ShaderLayout,
    private readonly settings: Settings
  ) {
    this.inputRouter = new InputRouter(window, canvas)
    this.level = new TitleLevel(shaderLayout, atlas)
    this.rendererStateMachine = RendererStateMachine.make({
      window,
      canvas,
      onFrame: this.onFrame.bind(this),
      newRenderer: () => Renderer.make(canvas, atlasImage, shaderLayout)
    })
  }

  start(): void {
    if (this.settings.windowMode === WindowModeSetting.FULLSCREEN) {
      this.requestWindowSetting = FunctionUtil.once(() =>
        window.document.documentElement.requestFullscreen().catch(() => {})
      )
    }

    RendererStateMachine.start(this.rendererStateMachine)
    this.inputRouter.register()
  }

  stop(): void {
    this.inputRouter.deregister()
    RendererStateMachine.stop(this.rendererStateMachine)
  }

  private onFrame(then: number, now: number): void {
    const time = now - then
    const canvasWH = Viewport.canvasWH(window.document)
    const scale = this.level.scale(canvasWH)
    const cam = Viewport.cam(canvasWH, scale)

    this.inputRouter.record(this.recorder, canvasWH, cam, cam)
    this.recorder.update(time)

    const [set] = this.recorder.combo().slice(-1)
    const bits = set && InputSet.bits(set) & ~InputBit.POINT
    this.requestWindowSetting = this.requestWindowSetting(!!bits)

    const renderer = this.rendererStateMachine.renderer
    const loseContext = renderer.loseContext
    if (this.recorder.triggered(InputBit.DEBUG_CONTEXT_LOSS) && loseContext) {
      this.inputRouter.reset()
      this.inputRouter.record(this.recorder, canvasWH, cam, cam)
      this.recorder.update(time)

      console.log('Lose renderer context.')
      loseContext.loseContext()
      setTimeout(() => {
        console.log('Restore renderer context.')
        loseContext.restoreContext()
      }, 3 * 1000)
    }

    let update
    this.duration += time
    while (this.duration >= this.tick) {
      this.duration -= this.tick
      update = this.level.update(this.tick, canvasWH, cam)
      if (!update.nextLevel) break
    }

    if (!update) return
    if (update.nextLevel) {
      this.level = update.nextLevel
      Renderer.render(renderer, canvasWH, scale, cam, update)
    } else {
      this.stop()
    }
  }
}
