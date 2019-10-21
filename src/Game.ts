import {Assets} from './loaders/Assets'
import {FunctionUtil} from './utils/FunctionUtil'
import {InputPoller} from './inputs/InputPoller'
import {InputState} from './inputs/InputState'
import {LevelStateMachine} from './levels/LevelStateMachine'
import {Milliseconds} from 'aseprite-atlas'
import {Renderer} from './renderer/Renderer'
import {RendererStateMachine} from './renderer/RendererStateMachine'
import {Settings} from './settings/Settings'
import {Synth} from './audio/Synth'
import {UpdateState} from './updaters/UpdateState'
import {Viewport} from './renderer/Viewport'
import {WindowModeSetting} from './settings/WindowModeSettings'

export interface Game {
  readonly win: Window
  /** The total execution time in milliseconds excluding pauses. */
  age: Milliseconds
  /** The outstanding time elapsed accrual to execute in milliseconds. */
  time: Milliseconds
  /** The exact duration in milliseconds to apply each update. Any number of
      updates may occur per animation frame. */
  readonly tick: Milliseconds
  readonly levelStateMachine: LevelStateMachine
  readonly rendererStateMachine: RendererStateMachine
  readonly inputPoller: InputPoller
  readonly synth: Synth
  requestWindowSetting: FunctionUtil.Once
  readonly settings: Settings
}

export namespace Game {
  export function make(
    win: Window,
    canvas: HTMLCanvasElement,
    {atlas, atlasImage, shaderLayout}: Assets,
    settings: Settings
  ): Game {
    const game: Game = {
      win,
      age: 0,
      time: 0,
      tick: 1000 / 60,
      levelStateMachine: LevelStateMachine.make(shaderLayout, atlas),
      rendererStateMachine: RendererStateMachine.make({
        win,
        canvas,
        onFrame: time => onFrame(game, time),
        onPause: () => {},
        newRenderer: () => Renderer.make(canvas, atlasImage, shaderLayout)
      }),
      inputPoller: InputPoller.make(),
      synth: Synth.make(),
      requestWindowSetting: newRequestWindowSetting(
        settings.windowMode,
        win.document
      ),
      settings
    }
    return game
  }

  export function start(game: Game): void {
    // Disable the context menu.
    game.win.document.oncontextmenu = () => false
    RendererStateMachine.start(game.rendererStateMachine)
    InputPoller.register(game.inputPoller, game.win, true)
    Synth.play(game.synth, 'sawtooth', 200, 500, 0.15)
  }

  export function stop(game: Game): void {
    InputPoller.register(game.inputPoller, game.win, false)
    RendererStateMachine.stop(game.rendererStateMachine)
    game.win.close()
  }
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

function onFrame(game: Game, time: number): void {
  if (!game.levelStateMachine.level) return Game.stop(game)

  const canvasWH = Viewport.canvasWH(game.win.document)
  const {minViewport} = game.levelStateMachine.level
  const scale = Viewport.scale(canvasWH, minViewport, 0)
  const camWH = Viewport.camWH(canvasWH, scale)
  game.levelStateMachine.level.cam.sizeTo(camWH)

  const anyInput = InputState.anyActive(game.inputPoller.inputs)
  game.requestWindowSetting = game.requestWindowSetting(anyInput)

  game.time += time // Add elapsed time to the pending delta total.
  game.age += game.time - (game.time % game.tick) // Add delta less remainder.
  while (game.levelStateMachine.level && game.time >= game.tick) {
    game.time -= game.tick
    const state = UpdateState.make(
      game.win,
      game.tick,
      game.levelStateMachine.level,
      canvasWH,
      game.inputPoller.inputs
    )
    LevelStateMachine.update(game.levelStateMachine, state)
    InputPoller.update(game.inputPoller, game.tick)
  }

  const {renderer} = game.rendererStateMachine
  const {level, store} = game.levelStateMachine
  if (level)
    Renderer.render(
      renderer,
      game.age,
      canvasWH,
      scale,
      level.cam.bounds,
      store
    )
  else Game.stop(game)
}
