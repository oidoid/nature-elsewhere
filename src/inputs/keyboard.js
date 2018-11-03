import * as recorder from './recorder.js'

/**
 * An KeyboardEvent.key.
 * @typedef {string} Key
 */

/**
 * @typedef {Readonly<Record<Key, recorder.Mask>>} KeyMap
 */

/** @type {KeyMap} */ export const defaultKeyMap = {
  ArrowLeft: recorder.Mask.LEFT,
  ArrowRight: recorder.Mask.RIGHT,
  ArrowUp: recorder.Mask.UP,
  ArrowDown: recorder.Mask.DOWN,
  Escape: recorder.Mask.MENU,
  p: recorder.Mask.DEBUG_CONTEXT_LOSS,
  0: recorder.Mask.SCALE_RESET,
  '-': recorder.Mask.SCALE_DECREASE,
  '+': recorder.Mask.SCALE_INCREASE
}
