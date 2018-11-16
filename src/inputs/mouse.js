import * as recorder from './recorder.js'

/**
 * A MouseEvent.button.
 * @typedef {number} Button
 */

/**
 * @typedef {Readonly<Record<Button, recorder.Mask>>} ButtonMap
 */

/** @type {ButtonMap} */ export const defaultButtonMap = {
  0: recorder.Mask.PICK
}
