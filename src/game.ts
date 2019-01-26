import * as rendererStateMachine from './graphics/renderer-state-machine'
import {AtlasDefinition} from './images/atlas-definition'
import {Random} from './math/random'
import {Renderer} from './graphics/renderer'
import {Title} from './levels/00-title'

export class Game {
  private random: Random = new Random()
  private scale: number = 12
  private level: Level
  private rendererStateMachine: rendererStateMachine.RendererStateMachine
  constructor(
    window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: AtlasDefinition,
    palettesImage: HTMLImageElement
  ) {
    this.level = new Title(atlas, this.random)
    this.rendererStateMachine = rendererStateMachine.newRendererStateMachine(
      window,
      canvas,
      atlasImage,
      palettesImage,
      this.onAnimationFrame.bind(this)
    )
  }

  start() {
    this.rendererStateMachine.start()
  }

  stop() {
    this.rendererStateMachine.stop()
  }

  private onAnimationFrame(renderer: Renderer, then: number, now: number) {
    const camRect = cam(window, this.scale)
    const {nextLevel, dataView, length} = this.level.update(then, now, camRect)
    this.level = nextLevel

    renderer.render(canvasSize(window), this.scale, camRect, dataView, length)
  }
}

function canvasSize(window: Window) {
  return {
    w: window.document.documentElement.clientWidth,
    h: window.document.documentElement.clientHeight
  }
}

function cam(window: Window, scale: number): Rect {
  const {w, h} = canvasSize(window)
  return {x: 0, y: 0, w: Math.ceil(w / scale), h: Math.ceil(h / scale)}
}
