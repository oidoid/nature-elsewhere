/** @typedef {import('./animation-id').AnimationID} AnimationID */
/** @typedef {import('./atlas').Animation} Animation */

/**
 * A static texture region identified by AnimationID, positioned by position,
 * scaled by scale, and offset by scrollPosition.
 * @typedef {{
 *   readonly animationID: AnimationID
 *   cel: number
 *   readonly position: Mutable<XY>
 *   readonly scale: Mutable<XY>
 *   readonly scrollPosition: Mutable<XY>
 * }} State
 */

/**
 * @arg {AnimationID} animationID
 * @arg {XY} position
 * @arg {XY} scale
 * @arg {XY} scrollPosition
 * @arg {number} cel
 * @return {State}
 */
export function newState(
  animationID,
  position = {x: 0, y: 0},
  scale = {x: 1, y: 1},
  scrollPosition = {x: 0, y: 0},
  cel = 0
) {
  return {animationID, position, scale, scrollPosition, cel}
}
