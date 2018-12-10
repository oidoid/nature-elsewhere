import * as asepriteParser from './parsers/aseprite-parser.js'
import * as level0 from './assets/level0.js'
import * as entity from './entities/entity.js'
import * as keyboard from './inputs/keyboard.js'
import * as mouse from './inputs/mouse.js'
import * as player from './entities/player.js'
import * as random from './random.js'
import * as recorder from './inputs/recorder.js'
import * as renderer from './graphics/renderer.js'
import * as util from './util.js'
import {Store} from './store.js'
import {Limits} from './graphics/limits.js'
import atlasJSON from './assets/atlas.js'

/** @typedef {import('./drawables/atlas').Atlas} Atlas} */
/** @typedef {import('./level').Level} Level */

const defaultScale = 12

export class Game {
  /**
   * @arg {Window} window
   * @arg {HTMLCanvasElement} canvas
   * @arg {HTMLImageElement} atlasImage
   * @arg {HTMLImageElement} palettesImage
   */
  constructor(window, canvas, atlasImage, palettesImage) {
    /** @type {Window} */ this._window = window
    /** @type {Document} */ this._document = window.document
    /** @type {HTMLImageElement} */ this._atlasImage = atlasImage
    /** @type {HTMLImageElement} */ this._palettesImage = palettesImage
    /** @type {Atlas} */ this._atlas = asepriteParser.parse(atlasJSON)
    /** @type {random.State} */ this._random = random.newState(0)
    /** @type {Level} */ this._level0 = level0.newState(
      this._atlas,
      this._random
    )
    /** @type {Store} */ this._store = new Store()
    this._store.spawn(this._level0.entities)
    /** @type {entity.State} */ this._player = this._level0.player
    /** @type {Atlas} */ this._atlas = asepriteParser.parse(atlasJSON)

    /** @type {HTMLCanvasElement} */ this._canvas = canvas

    /** @type {renderer.State} */ this._renderer = renderer.newState(
      canvas,
      atlasImage,
      palettesImage
    )
    /** @type {number} */ this._frameID = NaN
    /** @type {recorder.Recorder} */ this._recorder = new recorder.WriteState()
    /** @type {number} */ this._scale = defaultScale
    /** @type {Rect} */ this._cam = {
      x: Limits.MIN,
      y: Limits.MIN,
      w: Limits.MAX,
      h: Limits.MAX
    }
  }

  /** @return {void} */
  bind() {
    this._document.addEventListener('visibilitychange', () =>
      this._onVisibilityChanged()
    )

    this._canvas.addEventListener('webglcontextlost', event =>
      this._onContextLost(event)
    )
    this._canvas.addEventListener('webglcontextrestored', event =>
      this._onContextRestored(event)
    )

    this._document.addEventListener('keydown', event =>
      this._onKeyChange(event)
    )
    this._document.addEventListener('keyup', event => this._onKeyChange(event))

    this._canvas.addEventListener('mousemove', event =>
      this._onMouseMove(event)
    )
    this._canvas.addEventListener('mousedown', event =>
      this._onMouseClickChange(event)
    )
    this._canvas.addEventListener('mouseup', event =>
      this._onMouseClickChange(event)
    )
  }

  /** @return {void} */
  start() {
    if (this._document.hidden || this._frameID) return
    this._frameID = this._window.requestAnimationFrame(now =>
      this._onLoop(now, now)
    )
  }

  /** @return {void} */
  stop() {
    if (!this._frameID) return
    this._window.cancelAnimationFrame(this._frameID)
    this._frameID = NaN

    // Any pending key up events are lost. Clear the state.
    this._recorder = new recorder.WriteState()
  }

  /**
   * @arg {Event} event
   * @return {void}
   */
  _onContextLost(event) {
    console.log('Context lost.')
    event.preventDefault()
  }

  /**
   * @arg {Event} event
   * @return {void}
   */
  _onContextRestored(event) {
    console.log('Context restored.')
    this._renderer = renderer.newState(
      this._canvas,
      this._atlasImage,
      this._palettesImage
    )
    event.preventDefault()
  }

  /**
   * @arg {KeyboardEvent} event
   * @return {void}
   */
  _onKeyChange(event) {
    const key = keyboard.defaultKeyMap[event.key]
    if (key === undefined) return
    const active = event.type === 'keydown'
    if (this._recorder instanceof recorder.ReadState) {
      this._recorder = this._recorder.write()
    }
    this._recorder = this._recorder.set(key, active)

    event.preventDefault()
  }

  /**
   * @arg {MouseEvent} event
   * @return {void}
   */
  _onMouseClickChange(event) {
    const button = mouse.defaultButtonMap[event.button]
    if (button === undefined) return
    const active = event.type === 'mousedown'
    if (this._recorder instanceof recorder.ReadState) {
      this._recorder = this._recorder.write()
    }
    const xy = this._clientToWorldXY({x: event.clientX, y: event.clientY})
    this._recorder = this._recorder.set(button, active, xy)

    event.preventDefault()
  }

  /**
   * @arg {MouseEvent} event
   * @return {void}
   */
  _onMouseMove(event) {
    const button = recorder.Mask.POINT
    const active = true
    if (this._recorder instanceof recorder.ReadState) {
      this._recorder = this._recorder.write()
    }
    const xy = this._clientToWorldXY({x: event.clientX, y: event.clientY})
    this._recorder = this._recorder.set(button, active, xy)

    event.preventDefault()
  }

  /**
   * @arg {XY} xy
   * @return {XY}
   */
  _clientToWorldXY({x, y}) {
    const canvas = this._canvasWH()
    return {
      x: this._cam.x + (x / canvas.w) * this._cam.w,
      y: this._cam.y + (y / canvas.h) * this._cam.h
    }
  }

  /**
   * @arg {number} then
   * @arg {number} now
   * @return {void}
   */
  _onLoop(then, now) {
    const milliseconds = now - then

    then = now
    this._frameID = this._window.requestAnimationFrame(now =>
      this._onLoop(then, now)
    )

    if (this._recorder instanceof recorder.ReadState) {
      // Input not pumped by event listener.
      this._recorder = this._recorder.write()
    }
    this._recorder = this._recorder.read(milliseconds)

    if (this._recorder.debugContextLoss(true)) {
      if (renderer.isContextLost(this._renderer)) {
        console.log('Restore renderer context.')
        renderer.debugRestoreContext(this._renderer)
      } else {
        console.log('Lose renderer context.')
        renderer.debugLoseContext(this._renderer)
      }
    }

    if (this._recorder.scaleIncrease(true)) {
      this._scale = Math.min(40, this._scale + 1)
    }
    if (this._recorder.scaleDecrease(true)) {
      this._scale = Math.max(1, this._scale - 1)
    }
    if (this._recorder.scaleReset(true)) {
      this._scale = defaultScale
    }

    player.step(this._player, milliseconds, this._atlas, this._recorder)

    const canvas = this._canvasWH()
    this._cam = this._camRect(canvas)

    const entities = this._store.step(
      milliseconds,
      this._atlas,
      this._recorder,
      this._level0,
      this._cam
    )
    const len = this._store.flushUpdatesToMemory(this._atlas, entities)

    renderer.render(
      this._renderer,
      canvas,
      this._scale,
      this._cam,
      this._store.getMemory(),
      len
    )

    // Clear point which has no off event.
    this._recorder = this._recorder.write()
    this._recorder = this._recorder.set(recorder.Mask.POINT, false)
  }

  /** @return {WH} */
  _canvasWH() {
    // Pixels rendered by the shader are 1:1 with the canvas. No canvas CSS
    // scaling.
    return {
      w: this._document.documentElement
        ? this._document.documentElement.clientWidth
        : 0,
      h: this._document.documentElement
        ? this._document.documentElement.clientHeight
        : 0
    }
  }

  /**
   * @arg {WH} canvas
   * @return {Rect}
   */
  _camRect(canvas) {
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
    return {
      x: Math.trunc(
        util.clamp(
          this._player.position.x - Math.trunc(canvas.w / (this._scale * 2)),
          this._level0.bounds.x,
          this._level0.bounds.x + this._level0.bounds.w
        )
      ),
      y: Math.trunc(
        util.clamp(
          this._player.position.y -
            Math.trunc((7 * canvas.h) / (this._scale * 8)),
          this._level0.bounds.y,
          this._level0.bounds.y + this._level0.bounds.h
        )
      ),
      w: Math.ceil(canvas.w / this._scale),
      h: Math.ceil(canvas.h / this._scale)
    }
  }

  /** @return {void} */
  _onVisibilityChanged() {
    if (this._document.hidden) {
      console.log('Hidden.')
      this.stop()
    } else {
      console.log('Visible.')
      this.start()
    }
  }
}
