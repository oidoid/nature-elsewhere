/** @typedef {import('../assets/animation-id').AnimationID} AnimationID */

/**
 * @typedef {Readonly<{
 *   animationID: AnimationID
 *   position: Mutable<XY>
 *   scale: Mutable<XY>
 *   scrollPosition: Mutable<XY>
 * }>} State
 */

/**
 * @arg {AnimationID} animationID
 * @arg {XY} position
 * @arg {XY} scale
 * @arg {XY} scrollPosition
 * @return {State}
 */
export function newState(
  animationID,
  position = {x: 0, y: 0},
  scale = {x: 1, y: 1},
  scrollPosition = {x: 0, y: 0}
) {
  return {animationID, position, scale, scrollPosition}
}
