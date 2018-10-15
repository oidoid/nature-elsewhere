import * as asepriteParser from './parsers/asepriteParser.js'
import * as level0 from './assets/level0.js'
import * as keyboard from './inputs/keyboard.js'
import * as recorder from './inputs/recorder.js'
import * as renderer from './graphics/renderer.js'
import {Entity} from './entities/entity.js'
import {Random} from './random.js'
import {Store} from './store.js'
import atlasJSON from './assets/atlas.js'

/** @typedef {import('./textures/atlas.js').Atlas} Atlas} */

const scale = 6

export class Game {
  /**
   * @arg {Window} window
   * @arg {HTMLImageElement} atlasImage
   */
  constructor(window, atlasImage) {
    /** @type {Window} */ this._window = window
    /** @type {Document} */ this._document = window.document
    /** @type {HTMLImageElement} */ this._atlasImage = atlasImage
    /** @type {Atlas} */ this._atlas = asepriteParser.parse(atlasJSON)
    /** @type {Random} */ this._random = new Random(0)
    /** @type {level0.Level0} */ this._level0 = level0.newState(
      this._atlas,
      this._random
    )
    /** @type {Store} */ this._store = new Store()
    this._store.spawn(this._level0.entities)
    /** @type {Entity} */ this._player = this._level0.player
    /** @type {Atlas} */ this._atlas = asepriteParser.parse(atlasJSON)

    const canvas = document.querySelector('canvas')
    if (!canvas) throw new Error('Canvas missing.')
    /** @type {HTMLCanvasElement} */ this._canvas = canvas

    /** @type {renderer.Renderer} */ this._renderer = renderer.newRenderer(
      canvas,
      atlasImage
    )

    /** @type {number} */ this._frameID = NaN

    /** @type {recorder.Recorder} */ this._recorder = new recorder.WriteState()

    this._onContextLost = this._onContextLost.bind(this)
    this._onContextRestored = this._onContextRestored.bind(this)
    this._onKeyChange = this._onKeyChange.bind(this)
    this._onLoop = this._onLoop.bind(this)
    this._onVisibilityChanged = this._onVisibilityChanged.bind(this)
  }

  /** @return {void} */
  bind() {
    this._document.addEventListener(
      'visibilitychange',
      this._onVisibilityChanged
    )

    this._canvas.addEventListener('webglcontextlost', this._onContextLost)
    this._canvas.addEventListener(
      'webglcontextrestored',
      this._onContextRestored
    )

    this._document.addEventListener('keydown', this._onKeyChange)
    this._document.addEventListener('keyup', this._onKeyChange)
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
    this._renderer = renderer.newRenderer(this._canvas, this._atlasImage)
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
   * @arg {number} then
   * @arg {number} now
   * @return {void}
   */
  _onLoop(then, now) {
    // Steps are measured in milliseconds.
    const step = now - then

    then = now
    this._frameID = this._window.requestAnimationFrame(now =>
      this._onLoop(then, now)
    )

    if (this._recorder instanceof recorder.ReadState) {
      // Input not pumped by event listener.
      this._recorder = this._recorder.write()
    }
    this._recorder = this._recorder.read(step)

    if (this._recorder.debugContextLoss(true)) {
      if (this._renderer.isContextLost()) {
        console.log('Restore renderer context.')
        this._renderer.debugRestoreContext()
      } else {
        console.log('Lose renderer context.')
        this._renderer.debugLoseContext()
      }
    }

    this._store.step(step, this._atlas, this._recorder)
    this._store.flushUpdatesToMemory()
    // Pixels rendered by the shader are 1:1 with the canvas. No canvas CSS
    // scaling.
    const canvas = {
      w: document.documentElement ? document.documentElement.clientWidth : 0,
      h: document.documentElement ? document.documentElement.clientHeight : 0
    }
    this._renderer.render(
      canvas,
      scale,
      {x: this._player._position.x, y: this._player._position.y + 20},
      this._store._memory,
      this._store._entities.length
    )
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
