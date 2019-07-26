import * as Atlas from './atlas/atlas'
import * as atlasJSON from './assets/atlas/atlas.json'
import * as AtlasParser from './atlas/atlas-parser'
import * as FunctionUtil from './utils/function-util'
import * as ImageLoader from './loaders/image-loader'
import {InputBit} from './inputs/input-bit'
import {InputRouter} from './inputs/input-router'
import {InputSet} from './inputs/input-set'
import * as LevelStateMachine from './levels/level-state-machine'
import {Recorder} from './inputs/recorder'
import * as Renderer from './graphics/renderer/renderer'
import * as RendererStateMachine from './graphics/renderer/renderer-state-machine'
import * as Settings from './settings/settings'
import * as shaderConfig from './graphics/shaders/shader-config.json'
import {ShaderLayout} from './graphics/shaders/shader-layout'
import * as ShaderLayoutParser from './graphics/shaders/shader-layout-parser'
import * as Viewport from './graphics/viewport'
import {WindowModeSetting} from './settings/window-mode-setting'

export function load(): Promise<{
  atlas: Atlas.State
  atlasImage: HTMLImageElement
  shaderLayout: ShaderLayout
}> {
  return ImageLoader.load('assets/atlas/atlas.png').then(atlasImage => {
    const atlas = AtlasParser.parse(atlasJSON)
    const shaderLayout = ShaderLayoutParser.parse(shaderConfig)
    return {atlas, atlasImage, shaderLayout}
  })
}

export interface State {
  /** The outstanding time in milliseconds to apply. */
  duration: number
  /** The exact duration in milliseconds to apply each update. Any number of
   *  updates may occur per animation frame. */
  readonly tick: number
  levelStateMachine: LevelStateMachine.State
  readonly rendererStateMachine: RendererStateMachine.State
  readonly recorder: Recorder
  readonly inputRouter: InputRouter
  requestWindowSetting: FunctionUtil.Once
  readonly settings: Settings.State
}

export function make(
  window: Window,
  canvas: HTMLCanvasElement,
  atlasImage: HTMLImageElement,
  atlas: Atlas.State,
  shaderLayout: ShaderLayout,
  settings: Settings.State
): State {
  const state: State = {
    duration: 0,
    tick: 1000 / 60,
    levelStateMachine: LevelStateMachine.make(shaderLayout, atlas),
    rendererStateMachine: RendererStateMachine.make({
      window,
      canvas,
      onFrame: (then, now) => onFrame(state, then, now),
      newRenderer: () => Renderer.make(canvas, atlasImage, shaderLayout)
    }),
    recorder: new Recorder(),
    inputRouter: new InputRouter(window, canvas),
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
}

export function stop(state: State): void {
  state.inputRouter.deregister()
  RendererStateMachine.stop(state.rendererStateMachine)
}

function onFrame(state: State, then: number, now: number): void {
  if (!state.levelStateMachine.level) {
    stop(state)
    return
  }

  const time = now - then
  const canvasWH = Viewport.canvasWH(window.document)
  const scale = Viewport.scale(
    canvasWH,
    state.levelStateMachine.level.minSize,
    0
  )
  const cam = Viewport.cam(canvasWH, scale)

  state.inputRouter.record(state.recorder, canvasWH, cam, cam)
  state.recorder.update(time)

  const [set] = state.recorder.combo().slice(-1)
  const bits = set && InputSet.bits(set) & ~InputBit.POINT
  state.requestWindowSetting = state.requestWindowSetting(!!bits)

  const renderer = state.rendererStateMachine.renderer
  const loseContext = renderer.loseContext
  if (state.recorder.triggered(InputBit.DEBUG_CONTEXT_LOSS) && loseContext) {
    state.inputRouter.reset()
    state.inputRouter.record(state.recorder, canvasWH, cam, cam)
    state.recorder.update(time)

    console.log('Lose renderer context.')
    loseContext.loseContext()
    setTimeout(() => {
      console.log('Restore renderer context.')
      loseContext.restoreContext()
    }, 3 * 1000)
  }

  state.duration += time
  while (state.levelStateMachine && state.duration >= state.tick) {
    state.duration -= state.tick
    state.levelStateMachine = state.levelStateMachine.update(
      state.levelStateMachine,
      cam,
      state.tick
    )
  }

  if (state.levelStateMachine) {
    Renderer.render(
      renderer,
      canvasWH,
      scale,
      cam,
      state.levelStateMachine.store
    )
  } else {
    stop(state)
  }
}
