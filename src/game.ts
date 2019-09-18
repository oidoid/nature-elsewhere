import {Assets} from './loaders/assets'
import {Build} from './utils/build'
import {FunctionUtil} from './utils/function-util'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import {LevelStateMachine} from './levels/level-state-machine'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer/renderer'
import {RendererStateMachine} from './graphics/renderer/renderer-state-machine'
import {Settings} from './settings/settings'
import {Synth} from './audio/synth'
import {Viewport} from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'
import {UpdateState} from './entities/updaters/update-state'

export interface Game {
  readonly win: Window
  readonly doc: Document
  /** The total execution time in milliseconds excluding pauses. */
  age: number
  /** The outstanding time to execute in milliseconds. */
  time: number
  /** The exact duration in milliseconds to apply each update. Any number of
      updates may occur per animation frame. */
  readonly tick: number
  levelStateMachine: LevelStateMachine
  readonly rendererStateMachine: RendererStateMachine
  readonly recorder: Recorder
  readonly inputRouter: InputRouter
  readonly synth: Synth
  requestWindowSetting: FunctionUtil.Once
  readonly settings: Settings
}

export namespace Game {
  export const make = (
    win: Window,
    canvas: HTMLCanvasElement,
    {atlas, atlasImage, shaderLayout}: Assets,
    settings: Settings
  ): Game => {
    const doc = win.document
    const inputRouter = InputRouter.make(win)
    const ret: Game = {
      win,
      doc,
      age: 0,
      time: 0,
      tick: 1000 / 60,
      levelStateMachine: LevelStateMachine.make(shaderLayout, atlas),
      rendererStateMachine: RendererStateMachine.make({
        window: win,
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

  export const start = (val: Game): void => {
    // Disable the context menu.
    val.doc.oncontextmenu = () => false
    RendererStateMachine.start(val.rendererStateMachine)
    InputRouter.register(val.inputRouter, true)
    Synth.play(val.synth, 'sawtooth', 200, 500, 0.15)
  }

  export const stop = (val: Game): void => {
    InputRouter.register(val.inputRouter, false)
    RendererStateMachine.stop(val.rendererStateMachine)
    val.win.close()
  }

  const onFrame = (val: Game, time: number): void => {
    if (!val.levelStateMachine.level) return stop(val)

    const canvasWH = Viewport.canvasWH(val.doc)
    const {minViewport} = val.levelStateMachine.level
    const scale = Viewport.scale(canvasWH, minViewport, 0)
    const camWH = Viewport.camWH(canvasWH, scale)
    val.levelStateMachine.level.cam.bounds.w = camWH.w
    val.levelStateMachine.level.cam.bounds.h = camWH.h

    InputRouter.record(
      val.inputRouter,
      val.recorder,
      canvasWH,
      val.levelStateMachine.level.cam.bounds
    )
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
        UpdateState.make(time, val.levelStateMachine.level, val.recorder)
      )
    }

    const {renderer} = val.rendererStateMachine
    const {level, store} = val.levelStateMachine
    if (level)
      Renderer.render(
        renderer,
        val.age,
        canvasWH,
        scale,
        level.cam.bounds,
        store
      )
    else stop(val)
  }

  const processDebugInput = ({rendererStateMachine, recorder}: Game): void => {
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
