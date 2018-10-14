import * as aseprite from '../parsers/aseprite.js'

/** @typedef {Readonly<{size: WH; animations: AnimationMap}>} State */

/** @typedef {Readonly<Record<AnimationID, Animation>>} AnimationMap */

/** @typedef {aseprite.Tag} AnimationID */

/**
 * Animation and collision frames.
 * @typedef {Readonly<{
 *   cels: ReadonlyArray<Cel>
 *   direction: AnimationDirection
 * }>} Animation
 */

/**
 * A single cel of animation sequence.
 * @typedef {Object} Cel
 * @prop {Rect} bounds Texture bounds within the atlas.
 * @prop {number} duration Cel exposure in milliseconds, possibly infinite.
 * @prop {ReadonlyArray<Rect>} collision Collision bounds within the texture.
 */

/** @enum {string} */
export const AnimationDirection = aseprite.Direction
