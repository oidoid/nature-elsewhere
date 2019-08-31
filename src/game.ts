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
  readonly rendererStateMachine: RendererStateMachine
  readonly recorder: Recorder
  readonly inputRouter: InputRouter
  readonly synth: Synth
  requestWindowSetting: FunctionUtil.Once
  readonly settings: Settings
}

export namespace Game {
  export function make(
    window: Window,
    canvas: HTMLCanvasElement,
    {atlas, atlasImage, shaderLayout}: Assets,
    settings: Settings
  ): Game {
    const doc = window.document
    const inputRouter = InputRouter.make(window)
    const ret: Game = {
      doc,
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

  function newRequestWindowSetting(
    windowMode: WindowModeSetting,
    doc: Document
  ): FunctionUtil.Once {
    const full = () => doc.documentElement.requestFullscreen().catch(() => {})
    return windowMode === WindowModeSetting.FULLSCREEN
      ? FunctionUtil.once(full)
      : FunctionUtil.never()
  }

  export function start(state: Game): void {
    RendererStateMachine.start(state.rendererStateMachine)
    InputRouter.register(state.inputRouter, true)
    Synth.play(state.synth, 'sawtooth', 200, 500, 0.15)
  }

  export function stop(state: Game): void {
    InputRouter.register(state.inputRouter, false)
    RendererStateMachine.stop(state.rendererStateMachine)
  }

  function onFrame(state: Game, time: number): void {
    if (!state.levelStateMachine.level) return stop(state)

    const canvasWH = Viewport.canvasWH(state.doc)
    const {minSize} = state.levelStateMachine.level
    const scale = Viewport.scale(canvasWH, minSize, 0)
    const cam = Viewport.cam(canvasWH, scale)

    InputRouter.record(state.inputRouter, state.recorder, canvasWH, cam, cam)
    Recorder.update(state.recorder, time)

    const [set] = state.recorder.combo.slice(-1)
    const bits = set && InputSet.bits(set) & ~InputBit.POINT
    state.requestWindowSetting = state.requestWindowSetting(!!bits)
    if (Build.dev) processDebugInput(state)

    state.time += time
    state.age += state.time - (state.time % state.tick)
    while (state.levelStateMachine.level && state.time >= state.tick) {
      state.time -= state.tick
      state.levelStateMachine = LevelStateMachine.update(
        state.levelStateMachine,
        cam,
        state.tick,
        state.recorder
      )
    }

    const {renderer} = state.rendererStateMachine
    const {level, store} = state.levelStateMachine
    if (level) Renderer.render(renderer, state.age, canvasWH, scale, cam, store)
    else stop(state)
  }

  function processDebugInput({rendererStateMachine, recorder}: Game): void {
    const triggered = Recorder.triggered(recorder, InputBit.DEBUG_CONTEXT_LOSS)
    const {loseContext} = rendererStateMachine.renderer
    if (triggered && loseContext) {
      loseContext.loseContext()
      setTimeout(() => loseContext.restoreContext(), 3 * 1000)
    }
  }
}
