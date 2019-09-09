import {Assets} from './loaders/assets'
import {Build} from './utils/build'
import {FunctionUtil} from './utils/function-util'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import {LevelStateMachine} from './levels/level-state-machine'
import {Recorder} from './inputs/recorder'
import {Rect} from './math/rect'
import {Renderer} from './graphics/renderer/renderer'
import {RendererStateMachine} from './graphics/renderer/renderer-state-machine'
import {Settings} from './settings/settings'
import {Synth} from './audio/synth'
import {Viewport} from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'

export interface Game {
  readonly doc: Document
  /** The total execution time in milliseconds excluding pauses. */
  age: number
  /** The outstanding time to execute in milliseconds. */
  time: number
  /** The exact duration in milliseconds to apply each update. Any number of
      updates may occur per animation frame. */
  readonly tick: number
  levelStateMachine: LevelStateMachine
  readonly cam: Mutable<Rect>
  readonly rendererStateMachine: RendererStateMachine
  readonly recorder: Recorder
  readonly inputRouter: InputRouter
  readonly synth: Synth
  requestWindowSetting: FunctionUtil.Once
  readonly settings: Settings
}
type t = Game

export namespace Game {
  export const make = (
    window: Window,
    canvas: HTMLCanvasElement,
    {atlas, atlasImage, shaderLayout}: Assets,
    settings: Settings
  ): t => {
    const doc = window.document
    const inputRouter = InputRouter.make(window)
    const ret: t = {
      doc,
      cam: {x: 0, y: 0, w: 0, h: 0},
      age: 0,
      time: 0,
      tick: 1000 / 60,
      levelStateMachine: LevelStateMachine.make(shaderLayout, atlas),
      rendererStateMachine: RendererStateMachine.make({
        window,
        canvas,
        onFrame: time => onFrame(ret, time),
        onPause: () => InputRouter.reset(inputRouter),
        newRenderer: () => Renderer.make(canvas, atlasImage, shaderLayout)
      }),
      recorder: Recorder.make(),
      inputRouter,
      synth: Synth.make(),
      requestWindowSetting: newRequestWindowSetting(settings.windowMode, doc),
      settings
    }
    return ret
  }

  const newRequestWindowSetting = (
    windowMode: WindowModeSetting,
    doc: Document
  ): FunctionUtil.Once => {
    const full = () => doc.documentElement.requestFullscreen().catch(() => {})
    return windowMode === WindowModeSetting.FULLSCREEN
      ? FunctionUtil.once(full)
      : FunctionUtil.never()
  }

  export const start = (val: t): void => {
    // Disable the context menu.
    val.doc.oncontextmenu = () => false
    RendererStateMachine.start(val.rendererStateMachine)
    InputRouter.register(val.inputRouter, true)
    Synth.play(val.synth, 'sawtooth', 200, 500, 0.15)
  }

  export const stop = (val: t): void => {
    InputRouter.register(val.inputRouter, false)
    RendererStateMachine.stop(val.rendererStateMachine)
  }

  const onFrame = (val: t, time: number): void => {
    if (!val.levelStateMachine.level) return stop(val)

    const canvasWH = Viewport.canvasWH(val.doc)
    const {minSize} = val.levelStateMachine.level
    const scale = Viewport.scale(canvasWH, minSize, 0)
    ;({w: val.cam.w, h: val.cam.h} = Viewport.camWH(canvasWH, scale))

    InputRouter.record(val.inputRouter, val.recorder, canvasWH, val.cam)
    Recorder.update(val.recorder, time)

    const [set] = val.recorder.combo.slice(-1)
    const bits = set && InputSet.bits(set) & ~InputBit.POINT
    val.requestWindowSetting = val.requestWindowSetting(!!bits)
    if (Build.dev) processDebugInput(val)

    val.time += time
    val.age += val.time - (val.time % val.tick)
    while (val.levelStateMachine.level && val.time >= val.tick) {
      val.time -= val.tick
      val.levelStateMachine = LevelStateMachine.update(
        val.levelStateMachine,
        val.cam,
        val.tick,
        val.recorder
      )
    }

    const {renderer} = val.rendererStateMachine
    const {level, store} = val.levelStateMachine
    if (level)
      Renderer.render(renderer, val.age, canvasWH, scale, val.cam, store)
    else stop(val)
  }

  const processDebugInput = ({rendererStateMachine, recorder}: t): void => {
    const triggered = Recorder.triggeredSet(
      recorder,
      InputBit.DEBUG_CONTEXT_LOSS
    )
    const {loseContext} = rendererStateMachine.renderer
    if (triggered && loseContext) {
      loseContext.loseContext()
      setTimeout(() => loseContext.restoreContext(), 3 * 1000)
    }
  }
}
