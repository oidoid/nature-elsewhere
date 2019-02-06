import * as rendererStateMachine from './graphics/renderer-state-machine'
import {AtlasDefinition} from './images/atlas-definition'
import {Recorder} from './inputs/recorder'
import {Renderer} from './graphics/renderer'
import {Title} from './levels/00-title'
import {InputEventListener} from './inputs/input-event-listener'
import {InputMask} from './inputs/input-mask'

export class Game {
  private _level: Level
  private readonly rendererStateMachine: rendererStateMachine.RendererStateMachine
  private readonly _recorder: Recorder = new Recorder()
  private readonly _inputEventListener: InputEventListener
  constructor(
    private readonly _window: Window,
    canvas: HTMLCanvasElement,
    atlasImage: HTMLImageElement,
    atlas: AtlasDefinition,
    palettesImage: HTMLImageElement
  ) {
    this._inputEventListener = new InputEventListener(
      _window,
      canvas,
      this._recorder
    )
    this._level = new Title(atlas)
    this.rendererStateMachine = rendererStateMachine.newRendererStateMachine(
      _window,
      canvas,
      atlasImage,
      palettesImage,
      this.onAnimationFrame.bind(this)
    )
  }

  start(): void {
    this.rendererStateMachine.start()
    this._inputEventListener.register()
  }

  stop(): void {
    this._inputEventListener.deregister()
    this.rendererStateMachine.stop()
  }

  private onAnimationFrame(
    renderer: Renderer,
    then: number,
    now: number
  ): void {
    const milliseconds = now - then
    this.processInput(renderer, milliseconds)

    const scale = this._level.scale()
    const camRect = cam(this._window, scale)
    const {nextLevel, instances: dataView, length} = this._level.update(
      then,
      now,
      camRect
    )
    this._level = nextLevel

    renderer.render(canvasSize(this._window), scale, camRect, dataView, length)

    // Clear point which has no off event.
    this._recorder.set(InputMask.POINT, false)
  }

  private processInput(renderer: Renderer, milliseconds: number): void {
    // Verify input is pumped here or by event listener.
    this._recorder.write()
    this._recorder.read(milliseconds)

    if (this._recorder.debugContextLoss(true)) {
      console.log('Lose renderer context.')
      renderer.debugLoseContext()
      setTimeout(() => {
        console.log('Restore renderer context.')
        renderer.debugRestoreContext()
      }, 3 * 1000)
    }
  }
}

function canvasSize(window: Window): WH {
  const {clientWidth, clientHeight} = window.document.documentElement
  return {w: clientWidth, h: clientHeight}
}

function cam(window: Window, scale: number): Rect {
  const {w, h} = canvasSize(window)
  return {x: 0, y: 0, w: Math.ceil(w / scale), h: Math.ceil(h / scale)}
}

// canvasSize(this._window),
// cam(this._window, this.scale),

//   const xy = clientToWorld({x: event.clientX, y: event.clientY}, canvas, cam)

// function clientToWorld({x, y}: XY, canvas: WH, cam: Rect): XY {
//   return {x: cam.x + (x / canvas.w) * cam.w, y: cam.y + (y / canvas.h) * cam.h}
// }

// The camera's position is a function of the player position and the
// canvas' dimensions.
//
// The pixel position is rendered by implicitly truncating the model
// position. Similarly, it is necessary to truncate the model position prior
// to camera input to avoid rounding errors that cause the camera to lose
// synchronicity with the rendered position and create jitter when the
// position updates.
//
// For example, the model position may be 0.1 and the camera at an offset
// from the position of 100.9. The rendered position is thus truncated to 0.
// Consider the possible camera positions:
//
//   Formula                   Result  Pixel position  Camera pixel  Distance  Notes
//   0.1 + 100.9             =  101.0               0           101       101  No truncation.
//   Math.trunc(0.1) + 100.9 =  100.9               0           100       100  Truncate before input.
//   Math.trunc(0.1 + 100.9) =  101.0               0           101       101  Truncate after input.
//
// Now again when the model position has increased to 1.0 and the rendered
// position is also 1, one pixel forward. The distance should be constant.
//
//   1.0 + 100.9             =  101.9               1           101       100  No truncation.
//   Math.trunc(1.0) + 100.9 =  101.9               1           101       100  Truncate before input.
//   Math.trunc(1.0 + 100.9) =  101.0               1           101       100  Truncate after input.
//
// As shown above, when truncation is not performed or it occurs afterwards
// on the sum, rounding errors can cause the rendered distance between the
// center of the camera and the position to vary under different inputs
// instead of remaining at a constant offset.
