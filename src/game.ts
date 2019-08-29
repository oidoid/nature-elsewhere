import {Assets} from './loaders/assets'
import {FunctionUtil} from './utils/function-util'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import {LevelStateMachine} from './levels/level-state-machine'
import {Player} from './audio/player'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer/renderer'
import {RendererStateMachine} from './graphics/renderer/renderer-state-machine'
import {Settings} from './settings/settings'
import {Viewport} from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'

export namespace Game {
  export interface State {
    time: number
    /** The outstanding time in milliseconds to apply. */
    duration: number
    /** The exact duration in milliseconds to apply each update. Any number of
     *  updates may occur per animation frame. */
    readonly tick: number
    levelStateMachine: LevelStateMachine
    readonly rendererStateMachine: RendererStateMachine
    readonly recorder: Recorder
    readonly inputRouter: InputRouter
    player: Player
    requestWindowSetting: FunctionUtil.Once
    readonly settings: Settings
  }

  export function make(
    window: Window,
    canvas: HTMLCanvasElement,
    assets: Assets,
    settings: Settings
  ): State {
    const state: State = {
      time: 0,
      duration: 0,
      tick: 1000 / 60,
      levelStateMachine: LevelStateMachine.make(
        assets.shaderLayout,
        assets.atlas
      ),
      rendererStateMachine: RendererStateMachine.make({
        window,
        canvas,
        onFrame: (then, now) => onFrame(state, then, now),
        newRenderer: () =>
          Renderer.make(canvas, assets.atlasImage, assets.shaderLayout)
      }),
      recorder: Recorder.make(),
      inputRouter: new InputRouter(window),
      player: Player.make(),
      requestWindowSetting: FunctionUtil.never(),
      settings
    }
    return state
  }

  export function start(state: State): void {
    if (state.settings.windowMode === WindowModeSetting.FULLSCREEN) {
      state.requestWindowSetting = FunctionUtil.once(() =>
        window.document.documentElement.requestFullscreen().catch(() => {})
      )
    }

    RendererStateMachine.start(state.rendererStateMachine)
    state.inputRouter.register()
    Player.play(state.player, 'sawtooth', 200, 500, 0.15)
  }

  export function stop(state: State): void {
    state.inputRouter.deregister()
    RendererStateMachine.stop(state.rendererStateMachine)
  }

  function onFrame(state: State, then: number, now: number): void {
    if (!state.levelStateMachine.level) return stop(state)

    const delta = now - then
    state.time += delta
    const canvasWH = Viewport.canvasWH(window.document)
    const scale = Viewport.scale(
      canvasWH,
      state.levelStateMachine.level.minSize,
      0
    )
    const cam = Viewport.cam(canvasWH, scale)

    state.inputRouter.record(state.recorder, canvasWH, cam, cam)
    Recorder.update(state.recorder, delta)

    const [set] = state.recorder.combo.slice(-1)
    const bits = set && InputSet.bits(set) & ~InputBit.POINT
    state.requestWindowSetting = state.requestWindowSetting(!!bits)

    const renderer = state.rendererStateMachine.renderer
    const loseContext = renderer.loseContext
    if (
      Recorder.triggered(state.recorder, InputBit.DEBUG_CONTEXT_LOSS) &&
      loseContext
    ) {
      state.inputRouter.reset()
      state.inputRouter.record(state.recorder, canvasWH, cam, cam)
      Recorder.update(state.recorder, delta)

      console.log('Lose renderer context.')
      loseContext.loseContext()
      setTimeout(() => {
        console.log('Restore renderer context.')
        loseContext.restoreContext()
      }, 3 * 1000)
    }

    state.duration += delta
    while (state.levelStateMachine && state.duration >= state.tick) {
      state.duration -= state.tick
      state.levelStateMachine = LevelStateMachine.update(
        state.levelStateMachine,
        cam,
        state.tick,
        state.recorder
      )
    }

    if (state.levelStateMachine.level)
      Renderer.render(
        renderer,
        state.time,
        canvasWH,
        scale,
        cam,
        state.levelStateMachine.store
      )
    else stop(state)
  }
}
