import * as aseprite from '../parsers/aseprite.js'

/** @typedef {import('./animation-id').AnimationID} AnimationID */

/**
 * @typedef {Object} Atlas
 * @prop {WH} size Atlas dimensions in pixels.
 * @prop {AnimationMap} animations
 */

/**
 * AnimationIDs are aseprite.Tags.
 * @typedef {Readonly<Record<AnimationID, Animation>>} AnimationMap
 */

/**
 * Animation and collision frames.
 * @typedef {Object} Animation
 * @prop {WH} size Cel dimensions in pixels.
 * @prop {ReadonlyArray<Cel>} cels
 * @prop {AnimationDirection} direction
 */

/**
 * A single cel of an animation sequence.
 * @typedef {Object} Cel
 * @prop {XY} position Texture location within the atlas in pixels.
 * @prop {number} duration Nonzero cel exposure in milliseconds, possibly
 *                         infinite.
 * @prop {ReadonlyArray<Rect>} collision Collision bounds within the texture in pixels.
 */

/** @enum {string} */
export const AnimationDirection = aseprite.Direction
